import { Injectable } from '@angular/core';
import IWorkshop from './models/IWorkshop';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Hey Angular, Please create one instance of this class (i.e. new WorkshopService()) in the root injector - i..e this object will be available throughout the application
@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {
  private apiUrl = environment.apiUrl;

  constructor(private http : HttpClient) {
  }

  doSomething() {
    console.log( 'I did something' );
  }

  getWorkshops(page: number = 1) {
    return this.http.get<IWorkshop[]>(
      `${this.apiUrl}/workshops`,
      {
        params: {
          _page: page
        }
      }
    );
  }

  getWorkshopById(workshopId: number) {
    return this.http.get<IWorkshop>(
        `${this.apiUrl}/workshops/${workshopId}`
    );
  }

  deleteWorkshopById(workshopId: number) {
    return this.http.delete<void>(`${this.apiUrl}/workshops/${workshopId}`);
  }

  postWorkshop(workshop: Omit<IWorkshop, 'id'>) {
    return this.http.post<IWorkshop>(`${this.apiUrl}/workshops`, workshop, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
}
