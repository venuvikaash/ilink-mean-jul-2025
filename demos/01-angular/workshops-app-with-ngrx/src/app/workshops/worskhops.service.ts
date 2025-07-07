import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import IWorkshop from './models/IWorkshop';
import { catchError, retry } from 'rxjs';
import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class WorskhopsService {
  constructor(private http: HttpClient) {}

  // Note: To improve error handling based on type of err
  private errorHandler<ResponseDataType>(
    err: HttpErrorResponse,
    caught: Observable<ResponseDataType>
  ) {
    return throwError(() => new Error('Some error occured'));
  }

  public getWorkshops(page: number) {
    return this.http
      .get<IWorkshop[]>(`${apiUrl}/workshops`, {
        params: {
          _page: page,
        },
      })
      .pipe(retry(3), catchError(this.errorHandler));
  }

  public getWorkshopById(id: number) {
    return this.http
      .get<IWorkshop>(`${apiUrl}/workshops/${id}`)
      .pipe(retry(3), catchError(this.errorHandler));
  }

  public postWorkshop(workshop: Omit<IWorkshop, 'id'>) {
    return this.http
      .post<IWorkshop>(`${apiUrl}/workshops`, workshop, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(retry(3), catchError(this.errorHandler));
  }

  public putWorkshop(id: number, workshop: IWorkshop) {
    return this.http
      .put<IWorkshop>(`${apiUrl}/workshops/${id}`, workshop, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(retry(3), catchError(this.errorHandler));
  }

  public deleteWorkshopById(id: number) {
    return this.http
      .delete<null>(`${apiUrl}/workshops/${id}`)
      .pipe(retry(3), catchError(this.errorHandler));
  }
}
