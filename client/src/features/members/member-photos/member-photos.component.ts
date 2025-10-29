import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member.service';
import { Observable } from 'rxjs';
import { Photo } from '../../../types/member';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.component.html',
  styleUrl: './member-photos.component.css',
})
export class MemberPhotosComponent {
  private route = inject(ActivatedRoute);
  private memberSerive = inject(MemberService);
  protected photos$?: Observable<Photo[]>;

  constructor() {
    const memberId = this.route.parent?.snapshot?.paramMap.get('id');

    if (memberId) {
      this.photos$ = this.memberSerive.getMemberPhotos(memberId);
    }
  }

  get PhotoMocks() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png',
    }));
  }
}
