import { Component, Input, signal } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { User } from '../../types/user';

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

  showRegister(value: boolean) {
    this.isRegister.set(value);
  }
}
