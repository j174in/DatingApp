import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { of } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private likesService = inject(LikesService);
  private accountService = inject(AccountService);

  Init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.likesService.getLikesIds();

    return of(null);
  }
}
