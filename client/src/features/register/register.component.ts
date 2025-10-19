import {
  Component,
  EventEmitter,
  inject,
  Inject,
  input,
  Output,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../types/user';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // membersFromHome = input.required<User[]>();
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  //Output decorator
  // @Output() cancelRegister = new EventEmitter<boolean>();

  protected cred = {} as RegisterCreds;

  register() {
    this.accountService.register(this.cred).subscribe({
      next: (result) => {
        console.log(result), this.cancel();
      },
      error: (error) => console.log(error),
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
