import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { MemberListComponent } from '../features/members/member-list/member-list.component';
import { MemberDetailedComponent } from '../features/members/member-detailed/member-detailed.component';
import { ListsComponent } from '../features/lists/lists.component';
import { MessagesComponent } from '../features/messages/messages.component';
import { authGuard } from '../core/guards/auth.guard';
import { TestErrorsComponent } from '../features/test-errors/test-errors.component';
import { NotFoundComponent } from '../shared/errors/not-found/not-found.component';
import { ServerErrorComponent } from '../shared/errors/server-error/server-error.component';
import { MemberPhotosComponent } from '../features/members/member-photos/member-photos.component';
import { MemberProfileComponent } from '../features/members/member-profile/member-profile.component';
import { MemberMessagesComponent } from '../features/members/member-messages/member-messages.component';
import { memberResolver } from '../features/members/member.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'members/:id',
        resolve: { member: memberResolver },
        runGuardsAndResolvers: 'always',
        component: MemberDetailedComponent,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          {
            path: 'profile',
            component: MemberProfileComponent,
            title: 'Profile',
          },
          {
            path: 'photos',
            component: MemberPhotosComponent,
            title: 'Photos',
          },
          {
            path: 'messages',
            component: MemberMessagesComponent,
            title: 'Messages',
          },
        ],
      },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'errors', component: TestErrorsComponent },
  { path: '**', component: NotFoundComponent },
];

// :id is dynamic
// notfound page ( if it doesn't exits yet)
