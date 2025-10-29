import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent {
  //pipe to use when working with observable data
  //in order to observe an observable we were using subscribe method
  //A different approach is async pipe
  //we initially do fetch operations in angular lifecycle in ngoninit method
  //Async pipe automatically subscribe an unsubscribe

  private memberService = inject(MemberService);
  protected members$: Observable<Member[]>;

  constructor() {
    this.members$ = this.memberService.getMembers();
  }
}
