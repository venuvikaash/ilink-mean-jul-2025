import { Component } from '@angular/core';
import { WorkshopsService } from '../workshops';

@Component({
  selector: 'app-workshops-list',
  imports: [],
  templateUrl: './workshops-list.html',
  styleUrl: './workshops-list.scss'
})
export class WorkshopsList {
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
}
