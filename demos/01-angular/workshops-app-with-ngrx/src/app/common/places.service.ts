import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, map, retry } from 'rxjs';
import { environment } from 'environments/environment';

const apiUrl = environment.citiesApiUrl;

export interface IState {
  name: string;
  state_code: string;
}

export interface ICountry {
  name: string;
  iso3: string;
  iso2: string;
  states: IState[];
}

export interface ICountriesAndStatesApiResponse {
  error: boolean;
  msg: string;
  data: ICountry[];
}

export interface ICitiesApiResponse {
  error: boolean;
  msg: string;
  data: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private http: HttpClient) {}

  // Note: To improve error handling based on type of err
  private errorHandler<ResponseDataType>(
    err: HttpErrorResponse,
    caught: Observable<ResponseDataType>
  ) {
    return throwError(() => new Error(`An error occured | ${err.message}`));
  }

  // API Reference: https://documenter.getpostman.com/view/1134062/T1LJjU52#7255f1cc-b52d-41b3-b5a4-b1197db619b5
  public getCountriesAndStates() {
    return this.http
      .get<ICountriesAndStatesApiResponse>(`${apiUrl}/countries/states`)
      .pipe(
        map((responseBody) => {
          if (responseBody.error) {
            throw new Error('Unable to fetch data');
          }

          return responseBody.data;
        }),
        retry(3),
        catchError(this.errorHandler)
      );
  }

  public getCitiesByCountryAndState(country: string, state: string) {
    return this.http
      .post<ICitiesApiResponse>(
        `${apiUrl}/countries/state/cities`,
        {
          country,
          state,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(
        map((responseBody) => {
          if (responseBody.error) {
            throw new Error('Unable to fetch data');
          }

          return responseBody.data;
        }),
        retry(3),
        catchError(this.errorHandler)
      );
  }
}
