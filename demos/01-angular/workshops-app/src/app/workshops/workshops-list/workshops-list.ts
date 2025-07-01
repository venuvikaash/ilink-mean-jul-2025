import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { WorkshopsService } from '../workshops';
import IWorkshop from '../models/IWorkshop';

@Component({
  selector: 'app-workshops-list',
  imports: [
    CommonModule,
    NgbAlert
  ],
  templateUrl: './workshops-list.html',
  styleUrl: './workshops-list.scss'
})
export class WorkshopsList implements OnInit {
  workshops!: IWorkshop[];
  error: Error | null = null;
  loading: boolean = true;

  // short syntax for data member creation and initialization
  constructor(private workshopsService : WorkshopsService) {
    this.workshopsService.doSomething();
  }

  // Lifecycle method: executed when the component shows up on the screen
  ngOnInit() {
    this.loading = true;

    this.workshopsService.getWorkshops().subscribe(
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
}
