import { Component, inject } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { AccountService } from '../../core/services/account.service';
import { UserManagementComponent } from './user-management/user-management.component';
import { PhotoManagementComponent } from './photo-management/photo-management.component';

@Component({
  selector: 'app-admin',
  imports: [UserManagementComponent, PhotoManagementComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  protected accountService = inject(AccountService);
  protected activeTab = 'photos';
  protected tabs = [
    { tabName: 'Photos Management', value: 'photos' },
    { tabName: 'User Management', value: 'roles' },
  ];

  setCurrentTab(tabValue: string) {
    this.activeTab = tabValue;
  }
}
