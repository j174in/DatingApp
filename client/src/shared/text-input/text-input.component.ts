import { Component, input, Self, signal } from '@angular/core';
import {
  ControlValueAccessor,
  Form,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
})
export class TextInputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  maxDate = input<string>('');

  //@Self() modies DI, tells to only resolve immediate dependencies only don't go further
  //Add reactive forms module
  //add [formControl] bind html
  //add formControlName in parent

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
