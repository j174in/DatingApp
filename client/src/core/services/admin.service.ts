import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../../types/user';
import { Photo } from '../../types/member';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private baseApiUrl = environment.baseApiUrl;

  getUserWithRoles() {
    return this.http.get<User[]>(this.baseApiUrl + 'admin/users-with-roles');
  }

  editUserRole(userid: string, roles: string[]) {
    return this.http.post<string[]>(
      this.baseApiUrl + 'admin/edit-roles/' + userid + '?roles=' + roles,
      {}
    );
  }

  getPhotosForApproval() {
    return this.http.get<Photo[]>(this.baseApiUrl + 'admin/photos-to-moderate');
  }

  approvePhoto(photoId: number) {
    return this.http.post(
      this.baseApiUrl + 'admin/approve-photo/' + photoId,
      {}
    );
  }

  rejectPhoto(photoId: number) {
    return this.http.post(
      this.baseApiUrl + 'admin/reject-photo/' + photoId,
      {}
    );
  }
}
