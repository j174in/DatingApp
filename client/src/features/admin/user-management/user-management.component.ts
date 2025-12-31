import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../types/user';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  @ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
  private adminService = inject(AdminService);
  protected users = signal<User[]>([]);
  protected selectedUser: User | null = null;
  protected availableRoles = ['Admin', 'Member', 'Moderator'];

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: (users) => this.users.set(users),
    });
  }

  openRolesModal(user: User) {
    this.selectedUser = user;
    this.rolesModal.nativeElement.showModal();
  }

  toggleRole(event: Event, role: string) {
    if (!this.selectedUser) return;

    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedUser.roles.push(role);
    } else {
      this.selectedUser.roles = this.selectedUser.roles.filter(
        (r) => r !== role
      );
    }
  }

  updateRoles() {
    if (!this.selectedUser) return;
    this.adminService
      .editUserRole(this.selectedUser.id, this.selectedUser.roles)
      .subscribe({
        next: (updatedRoles) => {
          this.users.update((users) =>
            users.map((user) => {
              if (user.id === this.selectedUser?.id) user.roles = updatedRoles;
              return user;
            })
          );
          this.rolesModal.nativeElement.close();
        },
        error: (error) => console.log("Couldn't update roles " + error),
      });
  }
}
