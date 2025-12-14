import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  EditableMember,
  Member,
  MemberParams,
  Photo,
} from '../../types/member';
import { tap } from 'rxjs';
import { PaginatedResult, Pagination } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers(memberParams: MemberParams) {
    let params = new HttpParams();
    // .set('pageNumber', memberParams.pageNumber)
    // .set('pageSize', memberParams.pageSize)
    // .set('minAge', memberParams.minAge)
    // .set('maxAge', memberParams.maxAge)
    // if(memberParams.gender) .set('gender' , )

    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    params = params.append('orderBy', memberParams.orderBy);
    if (memberParams.gender)
      params = params.append('gender', memberParams.gender);

    //HttpParams are immuatable thats why this syntax, each append returns a new object
    // params = params.append('pageNumber', pageNumber);
    // params = params.append('pageSize', pageSize);
    return this.http
      .get<PaginatedResult<Member>>(this.baseUrl + 'members', {
        params,
      })
      .pipe(
        tap(() => {
          localStorage.setItem('filters', JSON.stringify(memberParams));
        })
      );
  }

  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap((member) => {
        this.member.set(member);
      })
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  updateMember(updatedMember: EditableMember) {
    return this.http.put(this.baseUrl + 'members', updatedMember);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(
      this.baseUrl + 'members/set-main-photo/' + photo.id,
      {}
    );
  }

  deletePhoto(photoid: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoid);
  }
}
