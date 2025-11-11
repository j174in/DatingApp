import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  imports: [],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.css',
})
export class DeleteButtonComponent {
  disabled = input<boolean>();
  clickEvent = output<Event>();

  OnClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
