import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/services/member.service';
import { inject } from '@angular/core';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  //resolvers resolve the data before or just coming into the route, so the data will be availbe in route
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');

  if (!memberId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return memberService.getMember(memberId);
};
