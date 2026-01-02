import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../types/user';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ToastService } from './toast.service';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root',
})
export class PresenceServiceService {
  private baseUrl = environment.baseHubUrl;
  private toastService = inject(ToastService);
  hubConnection!: HubConnection;
  onlineUsers = signal<string[]>([]);

  createPresenceHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.baseUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserOnline', (userId) => {
      this.onlineUsers.update((users) => [...users, userId]);
    });

    this.hubConnection.on('UserOffline', (userid) => {
      this.onlineUsers.update((users) => users.filter((x) => x !== userid));
    });

    this.hubConnection.on('GetUsersOnline', (users) => {
      this.onlineUsers.set(users);
    });

    this.hubConnection.on('NewMessageReceived', (message: Message) => {
      this.toastService.info(
        message.senderDisplayName + ' has send you a new message.',
        10000,
        message.senderImageUrl,
        `/members/${message.senderId}/messages`
      );
    });
  }

  stopHubConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }
}
