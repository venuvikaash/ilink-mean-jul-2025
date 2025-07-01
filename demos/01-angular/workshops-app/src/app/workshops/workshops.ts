import { Injectable } from '@angular/core';
import IWorkshop from './models/IWorkshop';
import { HttpClient } from '@angular/common/http';

// Hey Angular, Please create one instance of this class (i.e. new WorkshopService()) in the root injector - i..e this object will be available throughout the application
@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {
  constructor(private http : HttpClient) {
  }

  doSomething() {
    console.log( 'I did something' );
  }

  getWorkshops() {
    return this.http.get<IWorkshop[]>(
      `https://workshops-server.onrender.com/workshops`
    );
  }
}
