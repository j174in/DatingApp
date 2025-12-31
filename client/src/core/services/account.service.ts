import { HttpClient } from '@angular/common/http';
import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  //injectable and singletons
  //components are destroyed when they are outside of scope
  //app component is root so not destoryed
  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  currentUser = signal<User | null>(null);

  baseUrl = environment.baseApiUrl;

  register(creds: RegisterCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/register', creds, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  login(creds: LoginCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/login', creds, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  getRefreshToken() {
    return this.http.post<User>(
      this.baseUrl + 'account/refresh-token',
      {},
      { withCredentials: true }
    );
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http
        .post<User>(
          this.baseUrl + 'account/refresh-token',
          {},
          { withCredentials: true }
        )
        .subscribe({
          next: (user) => {
            this.setCurrentUser(user);
          },
          error: () => this.logout(),
        });
    }, 5 * 60 * 1000);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromJwt(user);
    this.currentUser.set(user);
    this.likesService.getLikesIds();
  }

  getRolesFromJwt(user: User): string[] {
    const roletoken = user.token.split('.')[1];
    const decoded = atob(roletoken);
    const jsonPaylod = JSON.parse(decoded);
    return Array.isArray(jsonPaylod.role) ? jsonPaylod.role : [jsonPaylod.role];
  }
}
