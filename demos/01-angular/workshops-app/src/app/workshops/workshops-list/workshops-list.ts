import { Component, OnInit } from '@angular/core';
import { WorkshopsService } from '../workshops';
import IWorkshop from '../models/IWorkshop';

@Component({
  selector: 'app-workshops-list',
  imports: [],
  templateUrl: './workshops-list.html',
  styleUrl: './workshops-list.scss'
})
export class WorkshopsList implements OnInit {
  // workshopsService = new WorkshopsService();
  // private workshopsService: WorkshopsService;

  // constructor(workshopsService : WorkshopsService) {
  //   this.workshopsService = workshopsService;

  //   this.workshopsService.doSomething();
  // }

  // short syntax for data member creation and initialization
  constructor(private workshopsService : WorkshopsService) {
    this.workshopsService.doSomething();
  }

  // Lifecycle method: executed when the component shows up on the screen
  ngOnInit() {
    console.log(
      this.workshopsService.getWorkshops()
    );
  }
}
