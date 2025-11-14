import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member.service';
import { Member, Photo } from '../../../types/member';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';
import { AccountService } from '../../../core/services/account.service';
import { User } from '../../../types/user';
import { StarButtonComponent } from '../../../shared/star-button/star-button.component';
import { DeleteButtonComponent } from '../../../shared/delete-button/delete-button.component';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUploadComponent, StarButtonComponent, DeleteButtonComponent],
  templateUrl: './member-photos.component.html',
  styleUrl: './member-photos.component.css',
})
export class MemberPhotosComponent implements OnInit {
  private route = inject(ActivatedRoute);
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  // protected photos$?: Observable<Photo[]>; Going to use signal , easier to manage
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  // constructor() {
  //   const memberId = this.route.parent?.snapshot?.paramMap.get('id');

  //   if (memberId) {
  //     this.photos$ = this.memberSerive.getMemberPhotos(memberId);
  //   }
  // }
  //Better to implement API fetch data in ngoninit

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot?.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  // get PhotoMocks() {
  //   return Array.from({ length: 20 }, (_, i) => ({
  //     url: '/user.png',
  //   }));
  // }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);
        if (!this.memberService.member()?.imageUrl) {
          this.setDefaultMainPhoto(photo);
        }
      },
      error: (err) => {
        console.log('error while uploading the photo');
        this.loading.set(false);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setDefaultMainPhoto(photo);
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () =>
        this.photos.update((photos) => photos.filter((x) => x.id !== photoId)),
    });
  }

  private setDefaultMainPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(
      (member) => ({ ...member, imageUrl: photo.url } as Member)
    );
  }
}
