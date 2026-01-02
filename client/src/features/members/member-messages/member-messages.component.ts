import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
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
import { PresenceServiceService } from '../../../core/services/presence-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [TimeAgoPipe, DatePipe, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  protected messageService = inject(MessagesService);
  private memberService = inject(MemberService);
  protected presenceService = inject(PresenceServiceService);
  private route = inject(ActivatedRoute);
  protected messageContent = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messageService.messageThread();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    });
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: (params) => {
        const otherUserId = params.get('id');
        if (!otherUserId) throw new Error('Cannot connect to hub');
        this.messageService.createHubConnection(otherUserId);
      },
    });
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;
    this.messageService
      .sendMessage(recipientId, this.messageContent)
      .then(() => {
        this.messageContent = '';
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
