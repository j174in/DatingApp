import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  protected creds: any = {};
  protected accountService = inject(AccountService);

  login() {
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        console.log(result), (this.creds = {});
      },
      error: (error) => alert(error.message),
    });
  }

  logout() {
    this.accountService.logout();
  }
}
