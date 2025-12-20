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
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.likesService.getLikesIds();
  }
}
