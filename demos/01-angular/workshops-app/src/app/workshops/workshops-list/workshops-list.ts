import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopsService } from '../workshops';
import IWorkshop from '../models/IWorkshop';

@Component({
  selector: 'app-workshops-list',
  imports: [
    CommonModule
  ],
  templateUrl: './workshops-list.html',
  styleUrl: './workshops-list.scss'
})
export class WorkshopsList implements OnInit {
  workshops!: IWorkshop[];

  // short syntax for data member creation and initialization
  constructor(private workshopsService : WorkshopsService) {
    this.workshopsService.doSomething();
  }

  // Lifecycle method: executed when the component shows up on the screen
  ngOnInit() {
    this.workshopsService.getWorkshops().subscribe(
      {
        next: ( w ) => {
          console.log( w );
          this.workshops = w;
        },
        error: ( err ) => {
          console.log( err );
        }
      }
    );
  }
}
