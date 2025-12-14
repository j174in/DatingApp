import {
  Component,
  ElementRef,
  input,
  model,
  output,
  Output,
  ViewChild,
} from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.css',
})
export class FilterModalComponent {
  @ViewChild('filterModal') modelRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitModal = output<MemberParams>();
  memberParams = model(new MemberParams());

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }

  open() {
    this.modelRef.nativeElement.showModal();
  }
  close() {
    this.modelRef.nativeElement.close();
    this.closeModal.emit();
  }
  submit() {
    this.submitModal.emit(this.memberParams());
    this.close();
  }

  onMinAgeChange() {
    if (this.memberParams().minAge < 18) this.memberParams().minAge = 18;
  }

  onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge)
      this.memberParams().maxAge = this.memberParams().minAge;
  }
}
