import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { LikesService } from '../../core/services/likes.service';
import { Member } from '../../types/member';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { LikesParams } from '../../types/likes';
import { PaginatedResult } from '../../types/pagination';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

@Component({
  selector: 'app-lists',
  imports: [MemberCardComponent, PaginatorComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  private likesService = inject(LikesService);
  protected paginatedResult = signal<PaginatedResult<Member> | null>(null);
  protected likeParams = new LikesParams();

  tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked By', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' },
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  OnPageChange(event: { pageNumber: number; pageSize: number }) {
    this.likeParams.pageNumber = event.pageNumber;
    this.likeParams.pageSize = event.pageSize;
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (predicate !== this.likeParams.predicate) {
      this.likeParams.predicate = predicate;
      this.likeParams.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.likeParams).subscribe({
      next: (members) => this.paginatedResult.set(members),
    });
  }
}
