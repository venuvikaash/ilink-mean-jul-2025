import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination {
  @Input()
  page: number = 1;

  @Output()
  pageChange = new EventEmitter<number>();

  changePage(by: number) {
    if (this.page + by <= 0) {
        return;
    }

    // communicate to the parent and pass on the new page number
    this.pageChange.emit(this.page + by); // emitting a number -> so that's the generic type parameter of the EventEmitter
  }
}
