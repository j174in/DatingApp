import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age.pipe';
import { LikesService } from '../../../core/services/likes.service';
import { PresenceServiceService } from '../../../core/services/presence-service.service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceServiceService);
  member = input.required<Member>();
  protected hasLiked = computed(() =>
    this.likeService.likeIds().includes(this.member().id)
  );
  protected isOnline = computed(() =>
    this.presenceService.onlineUsers().includes(this.member().id)
  );

  toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update((ids) =>
            ids.filter((id) => id !== this.member().id)
          );
        } else {
          this.likeService.likeIds.update((ids) => [...ids, this.member().id]);
        }
      },
    });
  }
}
