import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from 'environments/environment';

export interface ICredentials {
  email: string;
  password: string;
}

export interface ILoginResponse {
  email: string;
  authToken: string;
  role: 'admin' | 'general';
}

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private static KEY_USER = 'user';

  // do not expose the behavior subject - else anyone can emit values using it
  private isLoggedInSubject = new BehaviorSubject(this.isLoggedIn());

  // convert it to an observable
  public loggedInStatus$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: ICredentials) {
    return this.http
      .post<ILoginResponse>(`${apiUrl}/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((resp) => {
          // login successful if there's a jwt token in the response
          if (resp && resp.authToken) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
              AuthenticationService.KEY_USER,
              JSON.stringify(resp)
            );
          }

          return resp;
        }),
        tap(() => this.isLoggedInSubject.next(true))
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(AuthenticationService.KEY_USER);
    this.isLoggedInSubject.next(false);
  }

  getUser() {
    return JSON.parse(
      localStorage.getItem(AuthenticationService.KEY_USER) || '{}'
    );
  }

  isLoggedIn() {
    return !!localStorage.getItem(AuthenticationService.KEY_USER);
  }
}
