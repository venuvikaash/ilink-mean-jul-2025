import { Injectable } from '@angular/core';

// Hey Angular, Please create one instance of this class (i.e. new WorkshopService()) in the root injector - i..e this object will be available throughout the application
@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {
  constructor() { }

  doSomething() {
    console.log( 'I did something' );
  }
}
