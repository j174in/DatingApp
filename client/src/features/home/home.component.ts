import { Component, inject, Input, signal } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { User } from '../../types/user';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-home',
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  //property decorator
  // @Input({ required: true }) membersFromApp: User[] = [];
  protected isRegister = signal(false);
  protected accountService = inject(AccountService);
  
  showRegister(value: boolean) {
    this.isRegister.set(value);
  }
}
