import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ISession from './models/ISession';

@Injectable({
  providedIn: 'root'
})
export class Sessions {

  constructor(private http: HttpClient) {}

  getSessionsForWorkshop(workshopId: number) {
        return this.http.get<ISession[]>(
            `https://workshops-server.onrender.com/workshops/${workshopId}/sessions`
        );
    }
}
