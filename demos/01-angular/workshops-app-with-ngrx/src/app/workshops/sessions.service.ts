import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import ISession, { VoteType } from './models/ISession';
import { catchError, retry } from 'rxjs';
import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(private http: HttpClient) {}

  // Note: To improve error handling based on type of err
  private errorHandler<ResponseDataType>(
    err: HttpErrorResponse,
    caught: Observable<ResponseDataType>
  ) {
    return throwError(() => new Error('Some error occured'));
  }

  public getSessionsForWorkshop(workshopId: number, page: number) {
    return this.http
      .get<ISession[]>(`${apiUrl}/workshops/${workshopId}/sessions`, {
        params: {
          _page: page,
        },
      })
      .pipe(retry(3), catchError(this.errorHandler));
  }

  public voteForSession(sessionId: number | string, voteType: VoteType) {
    return this.http.put<ISession>(
      `${apiUrl}/sessions/${sessionId}/${voteType}`,
      {}
    );
  }

  public addSession(session: Omit<ISession, 'id'>) {
    return this.http
      .post<ISession>(`${apiUrl}/sessions`, session, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(retry(3), catchError(this.errorHandler));
  }
}
