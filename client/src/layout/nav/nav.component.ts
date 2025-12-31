import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { themes } from '../themes';
import { BusyService } from '../../core/services/busy.service';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  protected creds: any = {};
  private router = inject(Router);
  protected busyService = inject(BusyService);
  private toastService = inject(ToastService);
  protected accountService = inject(AccountService);
  protected selectedTheme = signal<string>(
    localStorage.getItem('theme') || 'light'
  );
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }

  login() {
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        this.router.navigateByUrl('/members'),
          (this.creds = {}),
          this.toastService.success('Logged In successfully');
      },
      error: (error) => this.toastService.error(error.error),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toastService.success('Logged out successfully');
  }
}
