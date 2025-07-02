import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../common/loading-spinner/loading-spinner';
import { ErrorAlert } from '../../common/error-alert/error-alert';
import { Pagination } from '../../common/pagination/pagination';
import { Item } from './item/item';
import { WorkshopsService } from '../workshops';
import IWorkshop from '../models/IWorkshop';

@Component({
  selector: 'app-workshops-list',
  imports: [
    CommonModule,
    LoadingSpinner,
    ErrorAlert,
    Item,
    Pagination
  ],
  templateUrl: './workshops-list.html',
  styleUrl: './workshops-list.scss'
})
export class WorkshopsList implements OnInit {
  workshops!: IWorkshop[];
  error: Error | null = null;
  loading = true;
  page = 1;

  // short syntax for data member creation and initialization
  constructor(private workshopsService : WorkshopsService) {
    this.workshopsService.doSomething();
  }

  getWorkshops() {
    this.workshopsService.getWorkshops(this.page).subscribe(
      {
        // called when operation (backend call) is successful - it is passed the data
        next: ( w ) => {
          console.log( w );
          this.workshops = w;
          this.loading = false;
        },

        // called when operation is unsuccessful - it is passed the error
        error: ( err ) => {
          console.log( err );
          this.loading = false;
          this.error = err;
        }
      }
    );
  }

  // Lifecycle method: executed when the component shows up on the screen
  ngOnInit() {
    this.loading = true;

    this.getWorkshops();
  }

  changePage(newPage: number) {
    this.page = newPage;

    this.getWorkshops();
  }
}
