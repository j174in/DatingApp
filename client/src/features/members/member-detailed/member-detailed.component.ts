import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, Observable, single } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age.pipe';
import { AccountService } from '../../../core/services/account.service';
import { PresenceServiceService } from '../../../core/services/presence-service.service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.component.html',
  styleUrl: './member-detailed.component.css',
})
export class MemberDetailedComponent implements OnInit {
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private activeRouter = inject(ActivatedRoute);
  protected presenceService = inject(PresenceServiceService);
  // protected member$?: Observable<Member>;
  // protected member = signal<Member | undefined>(undefined);
  // Computed signal can use other signal to work out what its value should be
  protected isCurrentUser = computed(() => {
    return (
      this.accountService.currentUser()?.id ===
      this.activeRouter.snapshot.paramMap.get('id')
    );
  });

  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');

  ngOnInit(): void {
    // this.member$ = this.loadMember();

    // this.activeRouter.data.subscribe({
    //   next: (data) => this.member.set(data['member']),
    // });

    //setting on intial load
    this.title.set(this.activeRouter.firstChild?.snapshot?.title);

    // Property	Value (for /dashboard/profile)	Description
    // this.route	The route for /dashboard	The parent route.
    // this.route.firstChild	The route for /profile	Points to the first and only currently active child route.
    // childRoute.snapshot	Snapshot of the /profile route	Provides static access to the route data.
    // childRoute.snapshot.url[0].path	'profile'	Retrieves the URL segment for the active child route.

    //changing based on router events
    this.router.events
      .pipe(filter((events) => events instanceof NavigationEnd))
      .subscribe({
        next: () =>
          this.title.set(this.activeRouter.firstChild?.snapshot?.title),
      });
  }

  loadMember() {
    const id = this.activeRouter.snapshot.paramMap.get('id');

    if (!id) return;

    return this.memberService.getMember(id);
  }
}
