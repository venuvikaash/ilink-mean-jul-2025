# Setting up authentication in an Angular app
Before getting started with these steps please do the dollowing.
1. Please refer to `demos/10-angular/workshops-app-completed` project to view the files referred to below.
2. Run the `workshops-server` in authenticated mode
```
npm run auth
```

## Step 1: Create a login component
Run this from the project folder in order to create the component
```
ng g c login
```

## Step 2: Set up routing to the login page
- Add the route path to the login page in `app/app.routes.ts`
```ts
{
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login-page' },
},
```
You should not be able to go to `http://localhost:4200/login` to see the login page

## Step 3: Set up the auth service
Create the auth service
```
ng g s common/auth/auth
```
Add login method that makes call to login endpoints, get the token, stores in local storage and passes it on to the caller (login component).
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
          // NOTE: Here it is assumed the response has the token in `authToken`. Check if that is the case. Else replace `authToken` with the correct token field name from response
          if (resp && resp.authToken) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
              AuthenticationService.KEY_USER,
              JSON.stringify(resp)
            );
          }

          return resp;
        })
      );
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
```

### Step 4: Set up the login page
The login component gets user name and password from the user and passes it on to the login endpoint. On success it redirects. On error a toast is displayed.
- `app/login/login.component.ts`
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastService } from 'app/common/toast/toast.service';
import {
  AuthenticationService,
  ICredentials,
} from 'app/common/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  credentials: ICredentials = {
    email: 'john.doe@example.com',
    password: 'Password123#',
  };

  loading = false;
  returnUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.credentials).subscribe({
      next: (data) => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.toastService.show({
          templateOrMessage: error.message,
          classname: 'bg-danger text-light',
          delay: 2000,
        });

        this.loading = false;
      },
    });
  }
}
```
- `app/login/login.component.html`
```html
<div class="col-md-6 col-md-offset-3">
  <h2>Login</h2>
  <form name="form" (ngSubmit)="f.form.valid && login()" #f="ngForm" novalidate>
    <div
      class="mb-3"
      [ngClass]="{ 'has-error': f.submitted && !username.valid }"
    >
      <label for="username">Username</label>
      <input
        type="text"
        class="form-control"
        id="username"
        name="username"
        [(ngModel)]="credentials.email"
        #username="ngModel"
        required
      />
      <div
        *ngIf="f.submitted && !username.valid"
        class="help-block text-danger"
      >
        Username is required
      </div>
    </div>
    <div
      class="mb-3"
      [ngClass]="{ 'has-error': f.submitted && !password.valid }"
    >
      <label for="password">Password</label>
      <input
        type="password"
        class="form-control"
        id="password"
        name="password"
        [(ngModel)]="credentials.password"
        #password="ngModel"
        required
      />
      <div
        *ngIf="f.submitted && !password.valid"
        class="help-block text-danger"
      >
        Password is required
      </div>
    </div>
    <div class="form-group">
      <button [disabled]="loading" class="btn btn-primary">Login</button>
      <img
        *ngIf="loading"
        src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
      />
    </div>
  </form>
</div>
```

### Step 5: Setting up HTTP interceptor
Your workshops list page would not be able to fetch data without passing the token. Configure the interceptor to add the token automatically to the outgoing HTTP requests.
- `app/common/auth/jwt.interceptor.ts`
```ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let user = this.authenticationService.getUser();

    // NOTE: Here it is assumed the response has the token in `authToken`. Check if that is the case. Else replace `authToken` with the correct token field name from response
    // Also check if backend accepts Authorization as `Bearer <token>` or simply `token`
    if (user && user.authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.authToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
```
- Add the interceptor to the app
- `app.config.ts`
```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { JwtInterceptor } from 'app/common/auth/jwt.interceptor';

import { routes } from './app.routes';
import { routes as workshopsRoutes } from './workshops/workshops.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideRouter(workshopsRoutes),
    provideRouter(routes),

    // IMPORTANT: odify this...
    provideHttpClient(
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi()
    ),

    // IMPORTANT: Add this...
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
};
```
Now, your workshops list page and other pages must be able to fetch data.
- Implement route guards that prevent navigation to protected pages for unauthenticated users. Create an `auth` guard inside `common/auth` folder.
```
ng g g common/auth/auth
```
- `common/auth/auth.ts` - Update it so that checks if the user is logged in using the authentication service's `isLoggedIn()` method. If so return true, else false. Also navigate to `/forbidden` route - you will need to add a component that tells the user they cannot view the page, and show the component it on this route. Alternatively, you can redirect to the `/login` route to show the login page.
```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  if (!authenticationService.isLoggedIn()) {
    router.navigateByUrl('/forbidden');
    return false;
  } else {
    return true;
  }
};
```
- Add the guard as a `CanActivate` guard to the protected pages. A `CanActivate` guard conditionally prevents navigation to next page when a `routerLink` is clicked or user directly tries to navigate to the protected page. In `workshops/workshops.route.ts`. Only 2 routes are shown below as a sample. Add the guard to any page you want to protect.
```ts
{
  path: 'workshops',
  component: WorkshopsListComponent,
  title: 'List of Workshops',
  canActivate: [authGuard],
},
{
  path: 'workshops/add',
  component: AddWorkshopComponent,
  title: 'Add a new workshop',
  canActivate: [authGuard],
},
```
- You should now be able to navigate to the protected pages (like `/workshops`) only if you are logged in.
- Now, make the Navigation Menu change when user logs in and logs out. The navigation menu should not show the links to protected pages ("List of Workshops", "Add Workshop" etc.) when user is logged out. Instead it should show only the login page link. When the user is logged in it shows the links to protected pages, and a logout button. To pass on this information in real-time to the navigation menu (i.e. when the user __logs in__ or __logs out__) we need a `BehaviorSubject` that emits an event through an associated `Observable`.
- `auth/common/auth.service.ts`
```ts
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
```
```ts
export class AuthenticationService {
  private static KEY_USER = 'user';

  // Add this...
  // do not expose the behavior subject - else anyone can emit values using it
  private isLoggedInSubject = new BehaviorSubject(this.isLoggedIn());

  // convert it to an observable and expose it to consumers (like the navigation menu)
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
        // Add this to fire an event on the exposed observable when the user logs in
        tap(
          () => this.isLoggedInSubject.next(true)
        )
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(AuthenticationService.KEY_USER);
    
    // Add this to fire an event on the exposed observable when the user logs out
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
```
- Make necessary changes to the navigation menu so that it updates when the user logs in and logs out.
- `common/menu/menu.component.ts`
```ts
import { Component, inject, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/common/auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, NgbDropdownModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  collapsed = true;
  
  // Add this - this will change whenever user logs in / logs out - this is done by subscribing to the observable in ngOnInit()
  isLoggedIn = false;

  authenticationService = inject(AuthenticationService);
  router = inject(Router);

  ngOnInit(): void {
    // Add this - subscribe to the observable to be notified when user logs in / logs out
    // we subscribe to be notified of changes in login status
    this.authenticationService.loggedInStatus$.subscribe(
      (isLoggedIn) => (this.isLoggedIn = isLoggedIn)
    );
  }

  logout(event: Event) {
    event.preventDefault();

    this.authenticationService.logout();

    this.router.navigateByUrl('/');
  }
}
```
- `common/menu/menu.component.html`
```html
<!-- https://stackblitz.com/run?file=src%2Fapp%2Fdropdown-navbar.ts -->
<nav class="navbar navbar-expand-md navbar-light bg-body-tertiary">
  <div class="container">
    <a
      class="navbar-brand"
      routerLink="/"
      routerLinkActive="active"
      [routerLinkActiveOptions]="{ exact: true }"
      role="button"
      >Workshops App</a
    >
    <button
      class="navbar-toggler"
      type="button"
      aria-controls="navbarContent"
      [attr.aria-expanded]="!collapsed"
      aria-label="Toggle navigation"
      (click)="collapsed = !collapsed"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div
      class="navbar-collapse"
      [class.collapse]="collapsed"
      id="navbarContent"
    >
      <ul class="navbar-nav me-auto">
        <li class="nav-item" role="button">
          <a
            class="nav-link"
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            tabindex="0"
            >Home</a
          >
        </li>
        <!-- Add conditional rendering for protected routes -->
        @if ( isLoggedIn ) {
        <li class="nav-item" role="button">
          <a
            class="nav-link"
            routerLink="/workshops"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            tabindex="0"
            >List of workshops</a
          >
        </li>
        <li class="nav-item" role="button">
          <a
            class="nav-link"
            routerLink="workshops/add"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            tabindex="0"
            >Add a workshop</a
          >
        </li>
        }
      </ul>

      <ul class="navbar-nav">
        <!-- Add conditional rendering for protected routes -->
        @if ( isLoggedIn ) {
        <li
          class="nav-item"
          ngbDropdown
          display="dynamic"
          placement="bottom-end"
        >
          <a
            class="nav-link"
            tabindex="0"
            ngbDropdownToggle
            id="navbarDropdown3"
            role="button"
          >
            Account & Preferences
          </a>
          <div
            ngbDropdownMenu
            aria-labelledby="navbarDropdown3"
            class="dropdown-menu"
          >
            <a
              ngbDropdownItem
              routerLink="/workshops/favorites"
              (click)="$event.preventDefault()"
              >Favorites</a
            >
            <a ngbDropdownItem href="#" (click)="logout($event)">Logout</a>
          </div>
        </li>
        } @else {
        <!-- Add conditional rendering - Login link is to be displayed only when user is NOT logged in -->
        <li class="nav-item" role="button">
          <a
            class="nav-link"
            routerLink="login"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            tabindex="0"
            >Login</a
          >
        </li>
        }
      </ul>
    </div>
  </div>
</nav>
```