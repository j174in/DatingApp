import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { filter, Observable } from 'rxjs';
import { Member, MemberParams } from '../../../types/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginatedResult } from '../../../types/pagination';
import { PaginatorComponent } from '../../../shared/paginator/paginator.component';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent, PaginatorComponent, FilterModalComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  //pipe to use when working with observable data
  //in order to observe an observable we were using subscribe method
  //A different approach is async pipe
  //we initially do fetch operations in angular lifecycle in ngoninit method
  //Async pipe automatically subscribe an unsubscribe

  //When we use async pipe we are not waiting for the member list to come back before displaying the web page when we click
  //next in the pagination so we need to go back to observable
  //We do lose our existing list of members when using async pipe
  @ViewChild('filterModal') modal!: FilterModalComponent;
  private memberService = inject(MemberService);
  protected paginatedResult = signal<PaginatedResult<Member> | null>(null);
  private memberParams = new MemberParams();
  private updatedParams = new MemberParams();

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: (result) => this.paginatedResult.set(result),
    });
  }

  OnPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    this.modal.close();
  }

  onFilterChange(data: MemberParams) {
    //we are referencing the same object. when one changes the other also do
    this.memberParams = { ...data };
    this.updatedParams = { ...data };
    this.loadMembers();
  }

  resetFilter() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }

  get displayMessage(): string {
    const defaultMember = new MemberParams();

    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(this.updatedParams.gender + 's');
    } else {
      filters.push('Males', 'Females');
    }

    if (
      this.updatedParams.minAge !== defaultMember.minAge ||
      this.updatedParams.maxAge !== defaultMember.maxAge
    ) {
      filters.push(
        `ages ${this.updatedParams.minAge} - ${this.updatedParams.maxAge}`
      );
    }

    filters.push(
      this.updatedParams.orderBy === 'lastActive'
        ? 'Recently active'
        : 'Newest members'
    );

    return filter.length > 0
      ? `Selected ${filters.join('  | ')}`
      : 'All members';
  }
}
