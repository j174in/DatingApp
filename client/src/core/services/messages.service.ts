import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { AccountService } from './account.service';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private baseUrl = environment.baseApiUrl;
  private hubUrl = environment.baseHubUrl;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private hub!: HubConnection;
  messageThread = signal<Message[]>([]);

  createHubConnection(otherUserId: string) {
    const currentUser = this.accountService.currentUser();
    if (!currentUser) return;

    this.hub = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'messages/?userId=' + otherUserId, {
        accessTokenFactory: () => currentUser.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hub.start().catch((error) => console.log(error));

    this.hub.on('ReceiveMessageThread', (messages: Message[]) => {
      this.messageThread.set(
        messages.map((message) => ({
          ...message,
          currentUserSender: message.senderId !== otherUserId,
        }))
      );
    });

    this.hub.on('NewMessageSend', (message: Message) => {
      message.currentUserSender = message.senderId !== otherUserId;
      this.messageThread.update((messages) => [...messages, message]);
    });
  }

  stopHubConnection() {
    if (this.hub.state === HubConnectionState.Connected) {
      this.hub.stop().catch((error) => console.log(error));
    }
  }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('container', container);
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'messages', {
      params,
    });
  }

  getMessageThread(memberId?: string) {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + memberId
    );
  }

  sendMessage(recipientId: string, content: string) {
    return this.hub.invoke('SendMessage', {
      recipientId,
      content,
    });
  }

  deleteMessage(messageId: string) {
    return this.http.delete(this.baseUrl + 'messages/' + messageId);
  }
}
