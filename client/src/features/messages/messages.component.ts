import { Component, inject, OnInit, signal } from '@angular/core';
import { MessagesService } from '../../core/services/messages.service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-messages',
  imports: [PaginatorComponent, RouterLink, DatePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  private messageService = inject(MessagesService);
  private confirmDialogService = inject(ConfirmDialogService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);

  tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' },
  ];

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService
      .getMessages(this.container, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.paginatedMessages.set(response);
          this.fetchedContainer = this.container;
        },
      });
  }

  async confirmDelete(event: Event, messageId: string) {
    event.stopPropagation();
    const ok = await this.confirmDialogService.confirm(
      'Are you sure you want to delete this message?'
    );
    if (ok) this.deleteMessage(messageId);
  }

  deleteMessage(messageId: string) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        const currentMessages = this.paginatedMessages();
        if (currentMessages?.items) {
          this.paginatedMessages.update((prev) => {
            if (!prev) return null;
            const newItems = prev.items.filter((x) => x.id !== messageId) || [];

            return {
              items: newItems,
              metadata: prev.metadata,
            };
          });
        }
      },
    });
  }

  setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  }

  OnPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }

  get isInbox(): boolean {
    return this.fetchedContainer === 'Inbox';
  }
}
