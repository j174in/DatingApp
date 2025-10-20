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
      { path: 'members/:id', component: MemberDetailedComponent },
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
