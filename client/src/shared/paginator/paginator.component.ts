import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent {
  pageSize = model(10);
  pageNumber = model(1);
  totalCount = input(0);
  totalPages = input(0);

  pageSizeOptions = input([5, 10, 20, 50]);

  lastItemIndex = computed(() => {
    return Math.min(this.pageSize() * this.pageNumber(), this.totalCount());
  });

  pageChange = output<{ pageNumber: number; pageSize: number }>();

  onPageChange(newpage?: number, pageSize?: EventTarget | null) {
    if (newpage) this.pageNumber.set(newpage);
    if (pageSize) {
      this.pageSize.set(Number((pageSize as HTMLSelectElement).value));
    }

    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    });
  }
}
