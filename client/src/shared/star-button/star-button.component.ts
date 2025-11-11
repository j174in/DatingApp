import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.component.html',
  styleUrl: './star-button.component.css',
})
export class StarButtonComponent {
  disabled = input<boolean>();
  selected = input<boolean>();
  clickEvent = output<Event>();

  OnClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
