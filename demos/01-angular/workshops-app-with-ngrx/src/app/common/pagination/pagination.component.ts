import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input()
  page: number = 1;

  @Input()
  lastPage: number = -1; // -1 indicates last page is unknown

  @Input()
  loading = false;

  @Input()
  error: Error | null = null;

  @Output()
  pageChange = new EventEmitter<number>();

  next() {
    if (this.lastPage === this.page || this.lastPage === this.page) {
      return;
    }

    this.pageChange.emit(this.page + 1);
  }

  previous() {
    if (this.page === 1) {
      return;
    }

    this.pageChange.emit(this.page - 1);
  }
}
