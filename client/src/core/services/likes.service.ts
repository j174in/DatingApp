import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../../types/member';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';
import { LikesParams } from '../../types/likes';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseApiUrl;
  //default access modifier is public
  likeIds = signal<string[]>([]);

  toggleLike(targetMemberId: string): Observable<object> {
    return this.http.post(`${this.baseUrl}likes/${targetMemberId}`, {});
  }

  getLikes(likeParams: LikesParams) {
    let params = new HttpParams();

    params = params.append('predicate', likeParams.predicate);
    params = params.append('pageSize', likeParams.pageSize);
    params = params.append('pageNumber', likeParams.pageNumber);
    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'likes', {
      params,
    });
  }

  getLikesIds() {
    return this.http.get<string[]>(this.baseUrl + 'likes/list').subscribe({
      next: (Ids) => this.likeIds.set(Ids),
    });
  }

  clearLikeIds() {
    this.likeIds.set([]);
  }
}
