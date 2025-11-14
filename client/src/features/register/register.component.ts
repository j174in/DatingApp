import {
  Component,
  inject,
  OnInit,
  output,
  signal,
  Signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterCreds } from '../../types/user';
import { AccountService } from '../../core/services/account.service';
import { TextInputComponent } from '../../shared/text-input/text-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // membersFromHome = input.required<User[]>();
  //Output decorator
  // @Output() cancelRegister = new EventEmitter<boolean>();
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  cancelRegister = output<boolean>();
  protected cred = {} as RegisterCreds;
  // protected registerForm: FormGroup = new FormGroup({});
  protected credentialForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.credentialForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.profileForm = this.fb.group({
      gender: ['male', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  nextStep() {
    if (this.credentialForm.valid) {
      this.currentStep.update((prevStep) => prevStep + 1);
    }
  }

  prevStep() {
    this.currentStep.update((prevStep) => prevStep - 1);
  }
  // ngOnInit(): void {
  //   this.initializeForm();
  // }

  // initializeForm() {
  //   this.registerForm = new FormGroup({
  //     email: new FormControl('johndoe@email.com', [
  //       Validators.required,
  //       Validators.email,
  //     ]),
  //     displayName: new FormControl('', Validators.required),
  //     password: new FormControl('', [
  //       Validators.required,
  //       Validators.minLength(4),
  //       Validators.maxLength(8),
  //     ]),
  //     confirmPassword: new FormControl('', [
  //       Validators.required,
  //       this.matchValues('password'),
  //     ]),
  //   });
  //   this.registerForm.controls['password'].valueChanges.subscribe(() => {
  //     this.registerForm.controls['confirmPassword'].updateValueAndValidity();
  //   });
  // }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent?.get(matchTo)?.value;
      return matchValue === control.value ? null : { passwordMismatch: true };
    };
  }

  register() {
    if (this.credentialForm.valid && this.profileForm.valid) {
      const formData = {
        ...this.credentialForm.value,
        ...this.profileForm.value,
      };

      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
        },
        error: (error) => {
          console.log(error), this.validationErrors.set(error);
        },
      });
    }
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
