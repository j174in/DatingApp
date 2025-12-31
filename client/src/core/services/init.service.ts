import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);

  Init() {
    return this.accountService.getRefreshToken().pipe(
      tap((user) => {
        this.accountService.setCurrentUser(user);
        this.accountService.startTokenRefreshInterval();
      })
    );
  }
}
