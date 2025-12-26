import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MessagesService } from '../../../core/services/messages.service';
import { MemberService } from '../../../core/services/member.service';
import { Message } from '../../../types/message';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [TimeAgoPipe, DatePipe, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  private messageService = inject(MessagesService);
  private memberService = inject(MemberService);
  protected messages = signal<Message[]>([]);
  protected messageContent = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messages();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    });
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    const memberId = this.memberService.member()?.id;
    this.messageService.getMessageThread(memberId).subscribe({
      next: (result) =>
        this.messages.set(
          result.map((message) => ({
            ...message,
            currentUserSender: message.senderId !== memberId,
          }))
        ),
    });
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;
    this.messageService
      .sendMessage(recipientId, this.messageContent)
      .subscribe({
        next: (result) => {
          this.messages.update((messages) => {
            result.currentUserSender = true;
            return [...messages, result];
          });
          this.messageContent = '';
        },
      });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
