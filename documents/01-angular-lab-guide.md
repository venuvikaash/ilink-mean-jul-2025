# Building the Workshops App using Angular
- __Documentation__: https://angular.dev/
- __Production backend__: https://workshops-server.onrender.com/
- __Development backend__: In `workshops-server` folder. To launch the local development server, execute the following in a new terminal. It launches on http://localhost:8001/workshops
```
cd workshops-server
npm i
npm start
```
- Completed frontend app can be run from the `workshops-app-completed` folder

## Before getting started
You will need Node `^18.19.1 || ^20.11.1 || ^22.0.0` in order to install Angular 18. Install a compatible version of Node if you don't have one.
```
node --version
node -v
```
- __Reference__: https://nodejs.org/en

## Step 1: Create the Angular app and run it
- Install Angular CLI as a global Node package. Since we shall use Angular Bootstrap that does not as yet support Angular 19, we install v18.
```
npm i -g @angular/cli@18
```
- You can check the installed version using this - make sure it is `18.x.x`
```
ng version
```
- Create the Angular app from the folder of your choice - make sure to make choices as discussed in class (Do not select SSR option). Change directory to the created project directory and run the app.
```
ng new workshops-app
cd workshops-app
npm start
```
- It is better to open the app (usually running at `http://localhost:4200/`) in Chrome.
- __Reference__: https://angular.dev/tools/cli/setup-local

## Step 2: Understand the project structure and basics of data binding
- Understand the purpose of each and every file in the project (starting from `package.json`), the organization of application code, the build process (that uses Webpack / Vite), and what happens when the Angular app launches in the browser. Also understand the decorator meta data and structure of components.
- Add some public data members / methods in `src/app/app.component.ts`.
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], // In version 16-, components belonged to some module and what the module imported, the component can use
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'Workshops Application';
  
  public changeTitle() {
    this.title = "My first Angular Application";
  }
}
```
__Note__: The `standalone` option indicates that the component need not be associated with an Angular module (which was the case until Angular 16). Till Angular 16, a component becomes usable only after it is added to an Angular module (which is used to organize and encapsulate components, directives, pipes, services etc.). The imports for a component were present in the `imports` of the associated `@NgModule`. Also till Angular 16 the style files were included using `styleUrls` and not `styleUrl`.
- Replace `src/app/app.component.html` with a simple UI like so. The component's UI can use the public data members / methods from the component class.
```html
<h1>{{ title }}</h1>
<hr />
<button (click)="changeTitle()">Change title</button>

<!-- Exercise -->
<span>You have clicked this button <span></span> times</span>
```
- Styles scoped to the component can be defined in `src/app/app.component.scss`. being scoped, the styles here affect only elements in the app component HTML.
```scss
h1 {
    color: crimson;
}
```
__Note__: Global styles can be defined in `src/styles.scss`
- __EXERCISE__: Introduce a data member to keep track of how many times the button is clicked, and display this in the span above.

## Step 3: Install Angular Bootstrap
- __Reference__: https://ng-bootstrap.github.io/#/home
Install Angular Bootstrap
```
ng add @ng-bootstrap/ng-bootstrap
```
- `ng add` runs `npm install` followed by some scripts that make changes to some of the files in the project in order to set up Angular Bootstrap.
- If `bootstrap` or `@popperjs/core` are not automatically installed, then install them as well
```
npm i bootstrap @popperjs/core
```
- Include Bootstrap SCSS in `src/styles.scss`
```scss
/* You can add global styles to this file, and also import other style files */

/* Importing Bootstrap SCSS file. */
@import 'bootstrap/scss/bootstrap';
```
- Let's use the `ngb-alert` component from Angular Bootstrap in order to check if the installations completed without issues. In `src/app/app.component.ts`,
```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgbAlertModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'Workshops Application';
  public count = 0;
  isOpen = true;

  public changeTitle() {
    this.title = "My first Angular Application";
    ++this.count;
    this.isOpen = true;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
```
__Note__: `NgbAlertModule` is imported for using the module's `ngb-alert` component. `CommonModule` has structural directives like `*ngIf`, `*ngFor` etc. If you instead use the directives `@if()` or `@for()` etc., you don't need to import `CommonModule`.
- `src/app/app.component.html`
```html
<!--
@if ( isOpen ) { // v17+
<ngb-alert type="info">
  Note that this app is built using Angular 18. The APIs in Angular <= 16 are
  significantly different.
</ngb-alert>
}
-->

<!-- v16-. IN v17+ to use this you need to import CommonModule -->

<!-- <ngb-alert type="info" *ngIf="isOpen" (closed)="isOpen = !isOpen"> -->
<ngb-alert type="info" *ngIf="isOpen" (closed)="toggle()">
  Note that this app is built using Angular 18. The APIs in Angular <= 16 are
  significantly different.
</ngb-alert>


<h1>{{ title }}</h1>
<hr />

<button (click)="changeTitle()">Change title</button>
<span>You have clicked this button <span>{{ count }}</span> times</span>
```

## Step 4: Add a simple navigation menu for the app
- Create the component. You could set the component files yourself, but you can benefit from the `ng g c` command to cut short that work. 
```
ng g c menu
```
__Note__: Always run these commands from the project folder. This can avoid nasty surprises.
- `src/app/menu/menu.component.ts`
```ts
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  isNavbarCollapsed = true;
}
```
- `src/app/menu/menu.component.html`
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container">
    <a class="navbar-brand" href="/demos/">Workshops App</a>
    <button
      class="navbar-toggler"
      type="button"
      (click)="isNavbarCollapsed = !isNavbarCollapsed"
      aria-controls="navbarNav"
      aria-expanded="!isNavbarCollapsed"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div
      id="navbarNav"
      [ngbCollapse]="isNavbarCollapsed"
      class="collapse navbar-collapse"
    >
      <!-- left menu -->
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/workshops">List of workshops</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/workshops/add">Add a workshop</a>
        </li>
      </ul>
      
      <!-- right menu (no .me-auto)-->
      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item" ngbDropdown>
          <a
            class="nav-link"
            tabindex="0"
            ngbDropdownToggle
            id="navbarDropdown1"
            role="button"
          >
            Account & Preferences
          </a>
          <div
            ngbDropdownMenu
            aria-labelledby="navbarDropdown1"
            class="dropdown-menu"
          >
            <a ngbDropdownItem href="/workshops/favorites"
              >Favorites</a
            >
            <a ngbDropdownItem href="#" (click)="$event.preventDefault()"
              >Logout</a
            >
          </div>
        </li>

        <!--
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
            <a ngbDropdownItem href="#">Logout</a>
          </div>
        </li>
        -->
      </ul>
    </div>
  </div>
</nav>
```
- Since all our pages are to have the menu on top, the `AppComponent` is a convenient place to include it. This avoids the need to include it in every page component individually.
- `src/app/app.component.ts`
```ts
import { MenuComponent } from './menu/menu.component';
```
```ts
@Component({
  /* existing meta data */
  imports: [/* existing imports */, MenuComponent],
})
export class AppComponent {
    // existing code...
}
```
- `src/app/app.component.html`
```html
<ngb-alert type="info" *ngIf="isOpen" (closed)="toggle()">
  Note that this app is built using Angular 18. The APIs in Angular <= 16 are
  significantly different.
</ngb-alert>

<!-- Insert this -->
<app-menu></app-menu>

<h1>{{ title }}</h1>
```
- `src/app/app.component.scss`
```scss
.alert {
    margin-bottom: 0;
    text-align: center;
}
```

## Step 5: Add a Home component
- Generate the component
```
ng g c home
```
- `src/app/home/home.component.ts`. We move the page's content (everything below the menu) to this component.
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public title = 'Workshops Application';
  public count = 0;

  public changeTitle() {
    this.title = "My first Angular Application";
    ++this.count;
  }
}
```
- `src/app/home/home.component.html`
```html
<h1>{{ title }}</h1>
<hr />
<button (click)="changeTitle()" class="btn btn-primary me-2">
  Change title
</button>
<span>You have clicked this button <span>{{ count }}</span> times</span>
```
- `src/app/home/home.component.scss`
```scss
h1 {
    color: crimson;
}
```
- Include the component in the app. In `src/app/app.component.ts`,
```ts
import { HomeComponent } from './home/home.component';
```
```ts
imports: [/* existing imports */, HomeComponent],
```
- `src/app/app.component.html`
```html
<!-- existing HTML -->
<!-- ... -->

<app-menu></app-menu>

<!-- Update this part -->
<div class="container my-4">
  <app-home></app-home>
</div>
```
- Now that we have made understood data-bnding, event hnadling basics, and made structural changes to move the home page contents to the home component, let's put in actual content for home in `src/app/app.component.html`
```html
<h1>Workshops App</h1>

<hr />

<section>
  <p>Welcome to Workshops App</p>
  <p>
    The app serves details of (fictitious) technical workshops happening in
    various cities. Every workshop has a broad topic (eg. JavaScript), and a
    workshop has many sessions (each session covers a sub-topic, eg. Closures in
    JavaScript).
  </p>
  <p>
    You can view a list of workshops, details of every workshop, add a workshop,
    view the list of sessions in a workshop, and also add a new session for a
    workshop.
  </p>
</section>
```
- You can also comment out the data members / methods in `sc/app/app.component.ts` if you'd like.

## Step 6: Set up more pages and routing
- Add a route for the Home component in `src/app/app.routes.ts`. The default path match strategy is `'prefix'` which means the window location can be a prefix of the route under consideration for it to be flagged as a match. You can explicitly set it to `'full'` as well. Redirection options can be utilized if needed on routes. An example is shown below as an illustration. Both `http://localhost:4200/` and `http://localhost:4200/home` will take the user to the home page (with the canonical path being `http://localhost:4200/`).
```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Workshops App',
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
];
```
- Create the following components. Note how the folder within which they have to be created is also mentioned.
```
ng g c workshops/workshops-list
ng g c workshops/add-workshop
ng g c workshops/favorites
```
- You can set up routes for the new components in `app.routes.ts`. But it is a good practice to set up routes in a modular fashion. So we set up the routes for the workshops related components in `src/workshops/workshops.routes.ts`.
```ts
import { Routes } from '@angular/router';

import { WorkshopsListComponent } from './workshops-list/workshops-list.component';
import { AddWorkshopComponent } from './add-workshop/add-workshop.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  {
    path: 'workshops',
    component: WorkshopsListComponent,
    title: 'List of workshops'
  },
  {
    path: 'workshops/add',
    component: AddWorkshopComponent,
    title: 'Add a workshop'
  },
  {
    path: 'workshops/favorites',
    component: FavoritesComponent,
    title: 'Favorite workshops'
  },
];
```
- Add the routes in order to configure the router in `src/app/app.config.ts`
```ts
import { routes as workshopsRoutes } from './workshops/workshops.routes';
```
```ts
providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), // This should already exist. If not add this as well.

    /* Insert this... */
    provideRouter(workshopsRoutes),
],
```
- Let the router decide the page to load. This is done by adding a `router-outlet` in the place where the page component is to be displayed. In `src/app/app.component.ts`,
```ts
import { RouterOutlet } from '@angular/router';
```
```ts
imports: [
    /* existing imports */,
    RouterOutlet,
],
```
- In `src/app/app.component.html`
```html
<div class="container my-4">
  <!-- <app-home></app-home> -->
  <router-outlet></router-outlet>
</div>
```
The component will now be selected based on the route (browser location). Change it manually in the address bar, and the page that is loaded should change based on the routes configured.

- If the top-level heading for all pages have to be like the one in home, we can modify `src/styles.scss` like so
```scss
/* Importing Bootstrap SCSS file. */
@import 'bootstrap/scss/bootstrap';

h1 {
    color: crimson;
}
```

## Step 7: Update the menu to route to the pages, and highlight the active route
- In `src/app/menu/menu.component.ts`
```ts
import { RouterLink, RouterLinkActive } from '@angular/router';
```
```ts
/*
    You can import RouterModule insted of separate imports of RouteLink and RouterLinkActive as well
    - routerLink -> prevents page refresh
    - routerLinkActive -> CSS classes to be applied on link matching the current browser address
    - [routerLinkActiveOptions] -> for exact matching (no separate import is needed to use this, the RouteLinkActive import will do)
*/
imports: [/* existing imports */, RouterLink, RouterLinkActive],
```
- In `src/app/menu/menu.component.html`. Note the attribute binding syntax for `routerLinkActiveOptions` (`[attr]="value"` where value is not a hardcoded string)
```html
<a
    class="navbar-brand"
    routerLink="/"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
>
    Workshops App
</a>
```
```html
<li class="nav-item">
    <a
    class="nav-link"
    routerLink="/"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
    >
    Home
    </a>
</li>
<li class="nav-item">
    <a
    class="nav-link"
    routerLink="/workshops"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
    >
    List of workshops
    </a>
</li>
<li class="nav-item">
    <a
    class="nav-link"
    routerLink="/workshops/add"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
    >
    Add a workshop
    </a>
</li>
```
```html
<a
    ngbDropdownItem
    routerLink="/workshops/favorites"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
>
    Favorites
</a>
<a ngbDropdownItem routerLink="#" (click)="$event.preventDefault()">
    Logout
</a>
```
- Customize the `active` class that is defined in Bootstrap. In `src/app/menu/menu.component.scss`,
```scss
// make sure the selector specificity is at least as much as Bootstrap's selector for the element - you can use the SAME selector that Bootstrap uses.
.navbar-nav .nav-link.active {
    color: crimson;
}
```
- You can now navigate the pages using the menu

## Step 8: Add a "page not found" page
- Create one
```
ng g c page-not-found
```
- In `src/app/page-not-found/page-not-found.component.ts`
```ts
import { RouterLink } from '@angular/router';
```
```ts
imports: [RouterLink],
```
- In `src/app/page-not-found/page-not-found.component.html`
```html
<p class="display-6">
  The page you are looking for does not exist. You can try going
  <a routerLink="">Home</a>, or check the
  <a routerLink="/workshops">list of workshops</a>
</p>
```
- Add a catch-all route __as the last route__ in `src/app/app.routes.ts`
```ts
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Workshops App',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Page Not Found | Workshops App',
  },
];
```
- Make sure the router is configured in such a way that __the catch all route configuration appears last__. In `src/app/app.config.ts`,
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    /*
        Order matters here - The route match is done one-by-one. App routes should be last, because it has the ** -> catch all (page not found)
    */
    provideRouter(workshopsRoutes),
    provideRouter(routes),
  ],
};
```

## Step 9: Fetch a list of workshops (hard-coded) using a service and use it to display the list of workshops
- First define the models to represent the data the service shall fetch and give to consumers. Create `src/app/workshops/models/IWorkshop.ts`. While it is not necessary to create ILocation and IModes as separate interfaces, it can help when we want to represent those nested objects. Again the choice between interface and type to define the model is upto you. We use interfaces here.
```ts
interface ILocation {
    address: string;
    city: string;
    state: string;
}

interface IModes {
    inPerson: boolean;
    online: boolean;
}

interface IWorkshop {
    name: string;
    category: string;
    id: number;
    description: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    time: string;
    location: ILocation;
    modes: IModes;
    imageUrl: string;
}

export type {
    ILocation,
    IModes,
    IWorkshop as default
};
```
- Define a service to fetch a list of workshops
```
ng g s workshops/workshops
```
- We hard-code the list now, but shall later fetch from the backend. In `src/app/workshops/workshops.service.ts`
```ts
import IWorkshop from './models/IWorkshop';
```
```ts
getWorkshops(): IWorkshop[] {
    return [
      {
        name: 'Angular JS Bootcamp',
        category: 'frontend',
        id: 1,
        description:
          '<p><strong>AngularJS</strong> (also written as <strong>Angular.js</strong>) is a JavaScript-based open-source front-end web application framework mainly maintained by Google and by a community of individuals and corporations to address many of the challenges encountered in developing single-page applications.</p><p>It aims to simplify both the development and the testing of such applications by providing a framework for client-side model–view–controller (MVC) and model–view–viewmodel (MVVM) architectures, along with components commonly used in rich Internet applications. (This flexibility has led to the acronym MVW, which stands for "model-view-whatever" and may also encompass model–view–presenter and model–view–adapter.)</p>',
        startDate: '2019-01-01T04:00:00.000Z',
        endDate: '2019-01-03T08:00:00.000Z',
        time: '9:30 am - 1:30 pm',
        location: {
          address: 'Tata Elxsi, Prestige Shantiniketan',
          city: 'Bangalore',
          state: 'Karnataka',
        },
        modes: {
          inPerson: true,
          online: false,
        },
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/AngularJS_logo.svg/2000px-AngularJS_logo.svg.png',
      },
      {
        name: 'React JS Masterclass',
        category: 'frontend',
        id: 2,
        description:
          '<p><strong>React</strong> (also known as <strong>React.js</strong> or <strong>ReactJS</strong>) is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.</p><p>React can be used as a base in the development of single-page or mobile applications. Complex React applications usually require the use of additional libraries for state management, routing, and interaction with an API.</p>',
        startDate: '2019-01-14T04:30:00.000Z',
        endDate: '2019-01-16T12:30:00.000Z',
        time: '10:00 am - 6:00 pm',
        location: {
          address: 'Tata Elxsi, IT Park',
          city: 'Trivandrum',
          state: 'Kerala',
        },
        modes: {
          inPerson: true,
          online: true,
        },
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png',
      },
    ];
}
```
- In `src/app/workshops/workshops-list/workshops-list.component.ts`. Note how services are "injected" into components through the constructor. this is how we use the Dependency Injection (DI) system of Angular, where Angular creates the service object(s), and we consume it (for eg. in components, pripes, directives, other services etc.). Angular 17+ provides a form general alternative using the `inject()` function that enables services to be used in not only classes (through constructor injection), but also inside functions. We will explore this way of dependency injection later. DI externalies dependencies, and makes it easy to switch between different implementations of a service (this can be useful during unit tests for example, to provide a mock implementation of a service instead of the actual one).
```ts
import { OnInit } from '@angular/core';
import IWorkshop from '../models/IWorkshop';
```
```ts
export class WorkshopsListComponent implements OnInit {
  loading = true;
  error: Error | null = null;
  workshops!: IWorkshop[]

  // This is how you might create a service instance without DI - but we do not prefer this (good practice).
  // w : WorkshopService
  // w = new WorkshopsService();

  // Dependency Injection -> The dependency, i.e. WorkshopsService object is given to this component when the object is created by Angular
  constructor(private w: WorkshopsService) {
    // this.w = w;
  }

  ngOnInit() {
    workshops = w.getWorkshops();
    console.log( workshops );
  }
}
```
Check the console to verify if the workshops fetched from the service are displayed.
- __Notes__:
1. When an access modifier is provided with the argument in the constructor, TypeScript create a data member with the same name (`w` here, and also sets it to the argument - `this.w = w`).
2. The `!` is needed in `workshops!` as the data member is not initialized neither at the time of declaration nor in the constuctor. Basically, we take the onus of initializing it before use, and the TS compiler does not report it as an error.

## Step 10: Fetch actual workshops from the backend and provide it as an Observable event
- In `src/app/app.config.ts` set up the app to use HTTP client service. This is needed in order to configure and make use of Angular's HTTP Client service to make HTTP calls to the backend.
```ts
import { provideHttpClient } from '@angular/common/http';
```
```ts
providers: [
    /* existing providers */

    provideHttpClient(),
]
```
- Inject `HttpClient` service and get data from the backend. The `HttpClient` instance methods like `get`, `post` etc. configure HTTP requests and return an Observable. The actual call is made when a consumer (in out case the `WorkshopsListComponent`) subscribes to the observable. The data fetched is the Observable's event. In `src/app/workshops/workshops.service.ts`. You can use the local development backend URL (`http://localhost:8001/workshops`) instead of the production URL if you wish. 
```ts
import { HttpClient } from '@angular/common/http';
```
```ts
export class WorkshopsService {
  constructor(private http: HttpClient) { }

  getWorkshops() {
    return this.http.get<IWorkshop[]>(`https://workshops-server.onrender.com/workshops`);
  }
}
```
- Update `src/app/workshops/workshops-list/workshops-list.component.ts` to consume the service. Note how Observables need to be subscribed to in order to start the task, and get the result (the object passed to `subscribe()` is an `Observer` object with `next()`, `error`, and `complete()` methods).
```ts
ngOnInit() {
    this.loading = true;

    w.getWorkshops().subscribe(
        {
            next: (workshops) => {
                this.workshops = workshops;
                this.loading = false;
                console.log(workshops);
            },
            error: (error) => {
                this.error = error;
                this.loading = false;
                console.log(error);
            },
        }
    );
}
```

## Step 11: Showing list of workshops and loading, error states
- In `src/app/workshops/workshops-list/workshops-list.component.html`,
```html
<!-- @for() is the modern way of working with Angular 17+.  Angular 16- supported looping through *ngFor -->
<!--  -->
@for( workshop of workshops; track workshop.id ) {
    <div>{{ workshop.name }}</div>
}
```
- __Notes__:
1. You can get hold of the index of the iteration, whether the iterated item is the first or last in the last etc. Check https://angular.dev/api/core/@for for further details.
2. `track` is set to any value that is unique for every workshop, eg. id, name etc. It is needed to boost the performance of list rendering when new elements are added to / removed from the list (best practice). In Angular 16 and before, setting track used to be more complicated and was done so - this is provided as reference and you can ignore this.
```ts
import { CommonModule } from '@angular/common';
```
```ts
imports: [CommonModule],
```
```ts
trackById(index: number, item: IWorkshop) {
    return item.id;
}
```
```html
<div *ngFor="let workshop of workshops; trackBy: trackById">
  {{ workshop.name }}
</div>
```
- Add loading and error states to enhance user experience. In `src/app/workshops/workshops-list/workshops-list.component.ts`,
```ts
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
```
```ts
imports: [CommonModule, NgbAlert],
```
- Add the UI for these states in `src/app/workshops/workshops-list/workshops-list.component.html`,
```html
@if(loading) {
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
} @else if( !loading && error ) {
    <ngb-alert type="danger">{{ error.message }}</ngb-alert>
} @else {
    @for( workshop of workshops; track workshop.id ) {
        <div>{{ workshop.name }}</div>
    }
}
```

## Step 12: Create utility components for showing loading and error states in the UI when fetching data from the backend
- Create `src/app/common/loading-spinner`, `src/app/common/error-alert` under the `src/app/common` folder
```
ng g c common/loading-spinner
ng g c common/error-alert
```
- Move the code for the spinner from `src/app/workshops/workshops-list/workshops-list.component.html` to `src/app/common/loading-spinner/loading-spinner.component.html`
```html
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
```
- In `src/app/workshops/workshops-list/workshops-list.component.ts`, we import `LoadingSpinnerComponent`
```ts
import { LoadingSpinnerComponent } from '../../common/loading-spinner/loading.spinner.component';
```
```ts
imports: [/* existing imports */, LoadingSpinnerComponent],
```
- Use this in place of the Bootstrap spinner in `src/app/workshops/workshops-list/workshops-list.component.html`
```html
<app-loading-spinner></app-loading-spinner>
```
- Move the code for the error alert from `src/app/workshops/workshops-list/workshop-list.component.html` to `src/app/common/error-alert/error-alert.component.html`. For now, let's hard-code the error message as `Some error occured`. As a good practice we check for null error object and display only if an error is actually passed.
```html
@if( error !== null ) {
    <ngb-alert type="danger">Some error occured</ngb-alert>
}
```
- We move the import for `NgbAlert` as well from `src/app/workshops/workshops-list/workshops-list.component.ts` to `src/app/common/error-alert/error-alert.component.ts` (do remove the same lines from `src/app/workshops/workshops-list/workshops-list.component.ts`)
```ts
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
```
```ts
imports: [ NgbAlert ],
```
- In `src/app/workshops/workshops-list/workshops-list.component.ts`, import the error alert component
```ts
import { ErrorAlertComponent } from '../../common/error-alert/error-alert.component';
```
```ts
@Component({
  ...
  imports: [CommonModule, LoadingSpinnerComponent, ErrorAlertComponent],
  ...
})
```
- In `src/app/workshops/workshops-list/workshops-list.component.html` add the `app-error-alert`. The component HTML looks like this now.
```html
@if(loading) {
    <app-loading-spinner></app-loading-spinner>
} @else if( !loading && error ) {
    <app-error-alert></app-error-alert>
} @else {
    @for( workshop of workshops; track workshop.id ) {
        <div>{{ workshop.name }}</div>
    }
}
```

## Step 13: Passing error object as input to error alert, theme variant as input to the spinner component, and showing it in the UI
- In the `src/app/common/error-alert/app-alert.component.ts` add an Input attribute
```ts
import { Component, Input } from '@angular/core';
```
```ts
export class ErrorAlertComponent {
  @Input()
  error!: Error | null;
}
```
- In `src/app/workshops/workshops-list/workshops-list.component.html` pass the `error` object to `app-error-alert`
```html
<app-error-alert [error]="error"></app-error-alert>
```
__Note__: Observe how attribute binding syntax is used to pass input data in the consumer component (workshops list component).
- Make use of the passed error in `src/app/common/error-alert/error-alert.component.html`
```html
@if( error !== null ) {
    <ngb-alert type="danger">{{ error.message }}</ngb-alert>
}
```
- Let's theme the spinner. We will add an input parameter `variant` that takes one of the 8 Bootstrap themes as a string input. First define the theme values as a type in `src/app/models/utils.ts`
```ts
type Theme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'info'
  | 'warning'
  | 'light'
  | 'dark';
export type { Theme };
```
- In `src/app/workshops/workshops-list/workshops-list.component.html`, pass in the variant as an input attribute.
```html
<app-loading-spinner variant="success"></app-loading-spinner>
```
- Accept it in `src/app/common/loading-spinner/loading-spinner.component.ts`
```ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../../models/utils';
```
```ts
imports: [CommonModule],
```
```ts
export class LoadingSpinnerComponent {
  @Input()
  variant!: Theme;
}
```
- In `src/app/common/loading-spinner/loading-spinner.component.html`, apply the appropriate Bootstrap spinner class conditionally using `ngClass` directive (comes from `CommonModule`)
```html
<div
  class="d-flex justify-content-center"
  [ngClass]="{
    'text-primary': variant === 'primary',
    'text-secondary': variant === 'secondary',
    'text-danger': variant === 'danger',
    'text-success': variant === 'success',
    'text-warning': variant === 'warning',
    'text-info': variant === 'info',
    'text-light': variant === 'light',
    'text-dark': variant === 'dark',
  }"
>
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
```

## Step 14: Create component for workshops list item
- Create a component to show a workshop item
```
ng g c workshops/workshops-list/item
```
- Import item in `src/app/workshops/workshops-list/workshops-list.component.ts`
```ts
import { ItemComponent } from './item/item.component';
```
```ts
imports: [
    /* existing imports */
    ItemComponent,
],
```
- In `src/app/workshops/workshops-list/workshops-list.component.html`, render the item in the loop, and pass the workshop as an input to it. We also set a responsive layout for list of items using the Boostrap Grid system.
```ts
<div class="row">
    @for( workshop of workshops; track workshop.id ) {
        <div class="col-12 col-md-4 my-3 d-flex">
            <app-item [workshop]="workshop"></app-item>
        </div>
    }
</div>
```
- In `src/app/workshops/workshops-list/item/item.component.ts`, accept the `workshop` input
```ts
import { Component, Input } from '@angular/core';
import IWorkshop from '../../models/IWorkshop';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input()
  workshop!: IWorkshop;
}
```
- In `src/app/workshops/workshops-list/item/item.component.html`, render the workshop
```html
@if( workshop !== null ) {
<div class="card p-3">
  <div class="card-img-top-wrapper">
    <img [src]="workshop.imageUrl" class="card-img-top" [alt]="workshop.name" />
  </div>
  <div class="card-body">
    <h5 class="card-title my-0">{{ workshop.name }}</h5>
    <div class="card-text">
      <div>{{ workshop.time }}</div>
      <div>{{ workshop.startDate }} - {{ workshop.endDate }}</div>
      <div>{{ workshop.location.address }}, {{ workshop.location.city }}, {{ workshop.location.state }} </div>
    </div>
    <a
      class="btn btn-primary btn-sm mt-4"
      [routerLink]="[workshop.id]"
      [attr.aria-label]="'Know more about ' + workshop.name"
      >Know more</a
    >
  </div>
</div>
}
```
- Provide required styles in `src/app/workshops/workshops-list/item/item.component.scss`
```scss
// :host targets the <app-item></app-item> element that "hosts" the HTML for this component
:host {
    display: flex;
}

.card-img-top-wrapper {
    height: 192px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    // nesting selectors in SCSS
    // in css this selector becomes -> .card-img-top-wrapper .card-img-top
    .card-img-top {
        width: 50%;
    }
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 240px;
}
```

## Step 15: Using the built-in and custom pipes to format displayed content
- Reference: https://angular.dev/guide/templates/pipes
- A pipe is a Angular feature used especially in templates to transform content to be displayed (eg. format and display dates) in a reusable way. We could do this using methods / services of our own, but pipes makes the job of formatting displayed content, easier. Import `DatePipe` in `src/app/workshops/workshops-list/item/item.component.ts`
```ts
import { DatePipe } from '@angular/common';
```
```ts
imports: [DatePipe],
```
- In ``
```html
<!-- <div>{{ workshop.startDate }} - {{ workshop.endDate }}</div> -->
<div>
    {{ workshop.startDate | date : "EEEE, MMMM d, y" }} -
    {{ workshop.endDate | date : "EEEE, MMMM d, y" }}
</div>
```
- Generate a custom pipe for formatting location information. The first argument is treating specially and is the value that appears to the left of the pipe symbol(`|`). The rest are arguments passed to the pipe after the pipe's name (see the HTML for understanding this better).
```
ng g p common/location
```
- In `src/app/common/location/location.pipe.ts`
```ts
import { Pipe, PipeTransform } from '@angular/core';
import { ILocation } from '../../workshops/models/IWorkshop';

@Pipe({
  name: 'location',
  standalone: true,
})
export class LocationPipe implements PipeTransform {
  transform(
    location: ILocation,
    format: 'short' | 'long' = 'long',
    numChars = 80
  ) {
    let locationStr = `${location.address}, ${location.city}, ${location.state}`;

    if (format === 'short') {
      locationStr = locationStr.substring(0, numChars) + '...';
    }
    
    return locationStr;
  }
}
```
- Import it in `src/app/workshops/workshops-list/item/item.component.ts`
```ts
import { LocationPipe } from '../../../common/location/location.pipe';
```
```ts
imports: [DatePipe, LocationPipe],
```
- Use it in `src/app/workshops/workshops-list/item/item.component.html`
```html
<!-- <div>{{ workshop.location.address }}, {{ workshop.location.city }}, {{ workshop.location.state }} </div> -->
<div>{{ workshop.location | location : "short" : 40 }}</div>
```

## Step 16: Add pagination for workshops list page
- Modify `src/app/workshops/workshops.service.ts` to support pagination (the backend takes an `_page` query string parameter)
```ts
getWorkshops( page: number = 1 ) {
    // Example: GET https://workshops-server.onrender.com/workshops?page=2
    return this.http.get<IWorkshop[]>(
      `https://workshops-server.onrender.com/workshops`,
      {
        params: {
          _page: page
        }
      }
    );
}
```
- Maintain `page` in `src/app/workshops/workshops-list/workshops-list.component.ts` and modify the call to `getWorkshops()`. Since we need to fetch both on first page load and on page number change, we isolate the data fetch logic into its on method, and call it from `ngOnInit()` and from `changePage()`. Note also that we are passing the page number to the service's `getWorkshops()`.
```ts
page = 1;
```
```ts
getWorkshops() {
    this.loading = true;

    w.getWorkshops(this.page).subscribe(
        {
            next: (workshops) => {
                this.workshops = workshops;
                this.loading = false;
                console.log(workshops);
            },
            error: (error) => {
                this.error = error;
                this.loading = false;
                console.log(error);
            },
        }
    );
}

ngOnInit() {
    this.getWorkshops();
}
```
```ts
// approach 1
// previousPage() {
//     --this.page;
//     this.getWorkshops();
// }

// nextPage() {
//     ++this.page;
//     this.getWorkshops();
// }

// approach 2
// You can define and use this instead of individually defining `previousPage()` and `nextPage()`
changePage(by: number) {
    if (this.page == 1 && by < 0) {
        return;
    }

    this.page = this.page + by;
    
    this.getWorkshops();
}
```
- In `src/app/workshops/workshops-list/workshops-list.component.html` add this
```html
<div class="my-2">
  <div class="mt-1">
    <!-- You can aletrnatively call previousPage() and nextPage(). But notice how we have defined changePage() using a single argument - this helps us avoid code duplication. -->
    <button class="btn btn-primary btn-sm me-2" (click)="changePage(-1)">
      Previous
    </button>
    <button class="btn btn-primary btn-sm" (click)="changePage(1)">Next</button>
  </div>
  <div>You are viewing page {{ page }}</div>
</div>
```

## Step 17: Creating and using a pagination component, communication from child to parent using the `@Output()` decorator
- It makes sense to create a utility component for pagination. That would make it reusable.
```
ng g c common/pagination
```
- `src/app/common/pagination/pagination.component.ts` - the component takes in `page` as an input. We will see later how the change of page can be handled - for now the method body is empty.
```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input()
  page: number = 1;
  
  changePage(by: number) {}
}
```
- `src/app/common/pagination/pagination.component.html`
```html
<div class="my-2">
  <div class="mt-1">
    <button class="btn btn-primary btn-sm me-2" (click)="changePage(-1)">
      Previous
    </button>
    <button class="btn btn-primary btn-sm" (click)="changePage(1)">Next</button>
  </div>
  <div>You are viewing page {{ page }}</div>
</div>
```
- Update `src/app/workshops/workshops-list/workshops-list.component.ts` to use this component instead
```ts
import { PaginationComponent } from '../../common/pagination/pagination.component';
```
```ts
imports: [
    /* existing imports */
    PaginationComponent,
]
```
- Update `src/app/workshops/workshops-list/workshops-list.component.html` to use the component instead
```html
<app-pagination
  [page]="page"
></app-pagination>
```
- Right now the pagination has stopped working. We hit a roadblock as the page in the `WorkshopsListComponent` needs to be updated when the `changePage()` method in `PaginationComponent` executes. So how does a child component communicate with its parent? Answer - `@Output()` and `EventEmitter`. In `src/app/common/pagination/pagination.component.ts`,
```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
```
```ts
// EventEmitter<data_type_of_output_data>
@Output()
pageChange = new EventEmitter<number>();

changePage(by: number) {
    if (this.page + by <= 0) {
        return;
    }

    // communicate the new page number to the parent
    this.pageChange.emit(this.page + by);
}
```
- Handle the event emitted by the child in the parent. In `src/app/workshops/workshops-list/workshops-list.component.html`
```html
<app-pagination
  [page]="page"
  (pageChange)="changePage($event)"
></app-pagination>
```
- In `src/app/workshops/workshops-list/workshops-list.component.ts`
```ts
changePage(newPage: number) {
    this.page = newPage;

    this.getWorkshops();
}
```
- To improve the user experience of the pagination component, we will support a `loading` input attribute that is to be set to `true` when the data is being fetched for a page. In `src/app/common/pagination/pagination.component.ts`,
```ts
@Input()
loading: boolean = false;
```
- In `src/app/common/pagination/pagination.component.html`
```html
@if(loading === true) {
  <div>Loading page {{ page }}</div>
} @else {
  <div>You are viewing page {{ page }}</div>
}
```
- In `src/app/workshops/workshops-list/workshops-list.component.html`,
```html
<app-pagination
  [page]="page"
  [loading]="loading"
  (pageChange)="changePage($event)"
></app-pagination>
```

## Step 18: Maintain page number state in query string
- Maintaining the current page number as a query string parameter, serves as current page state information. We can make use of this and enhance user experience further by loading the desired page of workshops on page load (i.e. if you are on `http://localhost:4200/workshops?page=2` and refresh the page, you can still fetch and load the second page of workshops instead of the first).
- In `src/app/workshops/workshops-list/workshops-list.component.ts`, first make the change to set the query string `page` parameter when user tries to navigate to a new page. We use the `Router` service for this. Then use the `ActivatedRoute::queryParamMap` to subscribe to changes in the query string.
```ts
changePage(newPage: number) {
    this.page = newPage;

    // set the query string in the route
    this.router.navigate(['/workshops'], {
        queryParams: {
            page: this.page,
        },
    });
}
```
```ts
constructor(
    private workshopsService: WorkshopsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
) {
    // this.getWorkshops();

    // this.activatedRoute.queryParamMap is an Observable that tracks changes to the query string -> thus whenever `page` in the query string changes, the next() method is called
    this.activatedRoute.queryParamMap.subscribe({
        next: (queryParams) => {
            const queryStr = queryParams.get('page');

            // when the page loads for the first time, there is no `page` query string parameter -> so we set page to 1. Later on there is some `page` value
            if (queryStr === null) {
                this.page = 1;
            } else {
                this.page = +queryStr; // convert `page` from string type to number
            }

            this.getWorkshops(); // page has changed -> get fresh data
        },
    });
}
```
- Navigate to different pages and refresh to note that the right data for the page is fetched.

## Step 19: 2-way data binding and implementing filtering of workshops list (by name) in the frontend
- In `src/app/workshops/workshops-list/workshops-list.component.ts`,
```ts
import { FormsModule } from '@angular/forms';
```
```ts
imports: [
    /* existing imports */
    FormsModule,
]
```
```ts
filterKey = 'Angular';
filteredWorkshops!: IWorkshop[];
```
```ts
next: (workshops) => {
    this.workshops = workshops;
    this.filteredWorkshops = workshops;
    this.loading = false;
},
```
```ts
filterWorkshops() {
    this.filteredWorkshops = this.workshops.filter((w) =>
        w.name.toLowerCase().includes(this.filterKey.toLowerCase())
    );
}
```
- In `src/app/workshops/workshops-list/workshops-list.component.html` add the following. `[(ngModel)]="variable"` enables 2-way data binding. 2-way data binding ensures the input state (value within the input), and `variable` are always in sync.
```html
<input
    type="search"
    class="form-control"
    placeholder="Type to search by name"
    [(ngModel)]="filterKey"
    (input)="filterWorkshops()"
/>

@if ( filterKey !== '' ) {
    <div>
        Workshops whose name has
        <span class="text-primary">{{ filterKey }}</span> are shown.
    </div>
}
```
```html
@for( workshop of filteredWorkshops; track workshop.id ) {
    <div class="col-12 col-md-4 my-3 d-flex">...</div>
}
```

## Step 20: Implementing filtering of workshops list (by category) in the backend
- Modify the service method `getWorkshops()` in `src/app/workshops/workshops.service.ts` to support filtering by category
```ts
getWorkshops(page: number = 1, category: string = '') {
    const params: { _page: number; category?: string } = {
        _page: page,
    };

    if (category !== '') {
        params.category = category;
    }

    return this.http.get<IWorkshop[]>(`${this.apiUrl}/workshops`, {
        // params: params,
        params,
    });
}
```
- Enable filtering by category in `src/app/workshops/workshops-list/workshops-list.component.ts`
```ts
filterByCategory(category: string) {
    this.workshopsService.getWorkshops(this.page, category).subscribe({
        next: (workshops) => {
            this.workshops = workshops;
            // A better alternative: If you make `this.workshops` and `this.filterKey` as signals, you can compute `this.filteredWorkshops` automatically when either `this.workshops` changes or `this.filterKey` changes
            this.filterWorkshops();
        },
    });
}
```
- Add the UI for filtering by category in `src/app/workshops/workshops-list/workshops-list.component.html`,
```html
<div class="btn-group my-3" role="group" aria-label="Filter by category">
    <button type="button" class="btn btn-danger" (click)="filterByCategory('frontend')">Frontend</button>
    <button type="button" class="btn btn-warning" (click)="filterByCategory('backend')">Backend</button>
    <button type="button" class="btn btn-success" (click)="filterByCategory('devops')">Devops</button>
    <button type="button" class="btn btn-info" (click)="filterByCategory('language')">Language</button>
    <button type="button" class="btn btn-light" (click)="filterByCategory('mobile')">Mobile</button>
    <button type="button" class="btn btn-dark" (click)="filterByCategory('database')">Database</button>
</div>
```

## Step 21: Adding a workshop details page
- Create the new component
```
ng g c workshops/workshop-details
```
- Set up the route. Observe the use of dynamic path parameters. The name `id` we have given to the second path fragment (first being `workshops`), will be useful later to extract the workshop's id from the browser windows' location. In `src/app/workshops/workshops.routes.ts` add this __AFTER__ the `workshops/add` route - the order is important as otherwise the `/workshops/add` location would be matched by the `workshops/:id` route due to ordering (first match wins).
```ts
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
```
```ts
{
    path: 'workshops/:id',
    component: WorkshopDetailsComponent,
    title: 'Workshop Details',
},
```
- Set the link in workshops list items to navigate to the workshop details page. In `src/app/workshops/workshops-list/item/item.component.ts`,
```ts
import { RouterLink } from '@angular/router';
```
```ts
imports: [/* existing imports */, RouterLink],
```
- In `src/app/workshops/workshops-list/item/item.component.html` make this change. Note the array form of using `routerLink` - it is an array of strings, with every string being a path fragment. The first is `'workshops'` a string literal, and the second is `workshop.id` a property of the `workshop` input variable (it is __NOT__ a string literal).
```html
<a [routerLink]="['/workshops', workshop.id]" class="btn btn-primary">Know more</a>
```
- Click on the workshop __Know more__ button-styled links to navigate to the details page.

## Step 22: Fetching and showing details of the workshop
- Add a method to fetch a workshop's details by its id in `src/app/workshops/workshops.service.ts`. Note that this API endpoint returns a single `Workshop` object (__NOT__ an array).
```ts
getWorkshopById(workshopId: number) {
    return this.http.get<IWorkshop>(
        `https://workshops-server.onrender.com/workshops/${workshopId}`
    );
}
```
- In `src/app/workshops/workshop-details/workshop-details.component.ts` add the following. Note that we use the `ActivatedRoute::paramMap` which is an Observable to extract the `id` from the path. `ActivatedRoute::snapshot` is an alternative to this when you just want the current value of `id` and not interested in tracking and reacting to changes in `id` (for example when the URL changes from `http:localhost:4200/workshops/1` to `http://localhost:4200/workshops/2`). Reference: https://stackoverflow.com/questions/46050849/what-is-the-difference-between-activatedroute-and-activatedroutesnapshot-in-angu
```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { LocationPipe } from '../../common/location/location.pipe';
import { WorkshopsService } from '../workshops.service';
import { LoadingSpinnerComponent } from '../../common/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../common/error-alert/error-alert.component';
```
```ts
imports: [
    DatePipe,
    LocationPipe,
    LoadingSpinnerComponent,
    ErrorAlertComponent,
],
```
```ts
export class WorkshopDetailsComponent implements OnInit {
    loading = true;
    error : Error | null = null;
    workshop!: IWorkshop;
    workshopId!: number;

    constructor(
        private workshopsService: WorkshopsService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loading = true;

        this.activatedRoute.paramMap.subscribe({
            next: (params) => {
                const idStr = params.get('id');
                this.workshopId = +(idStr as string);

                this.workshopsService
                    .getWorkshopById(this.workshopId)
                    .subscribe({
                        next: (workshop) => {
                            this.workshop = workshop;
                            this.loading = false;
                        },
                        error: (error) => {
                            this.error = error;
                            this.loading = false;
                        },
                    });
            },
        });
    }
}
```
- In `src/app/workshops/workshop-details/workshop-details.component.html` add the following. Note the use of `innerHTML` attribute to set `innerHTML` instead of `innerText` that is set using interpolation syntax (`{{ variable }}`). When using `innerHTML` for binding user-generated content (like user reviews, blog articles, comments, social media posts etc.) you need to be aware of XSS vulnerability. Make sure such content has been sanitized in the backend.
```html
@if(loading) {
    <app-loading-spinner variant="success"></app-loading-spinner>
} @else if(!loading && error) {
    <app-error-alert [error]="error"></app-error-alert>
} @else {
    <h1>{{ workshop.name }}</h1>

    <hr />

    <div class="row">
        <div class="col-12 col-md-4">
            <img [src]="workshop.imageUrl" [alt]="workshop.name" class="img-fluid" />
        </div>
        <div class="col-12 col-md-8">
            <div class="my-3">
                <div>{{ workshop.time }}</div>
                <div>
                    {{ workshop.startDate | date : "EEEE, MMMM d, y" }} -
                    {{ workshop.endDate | date : "EEEE, MMMM d, y" }}
                </div>
                <div>{{ workshop.location | location }}</div>
            </div>
            <div [innerHTML]="workshop.description"></div>
        </div>
    </div>
}
```
- __EXERCISE__: Use the `TitleService` of Angular to update the title of the workshop details page to the name of the actual workshop loaded

## Step 23: Install FontAwesome and use its icons
- [FontAwesome](https://fontawesome.com/) provides a large set of icons for free (free for use in commercial projects). Follow the steps at https://www.npmjs.com/package/@fortawesome/angular-fontawesome to use it in Angular apps like this one.
```
ng add @fortawesome/angular-fontawesome
```
- Make available necessary icons like so. Add this in `src/app/workshops/workshop-details/workshop-details.component.ts`
```ts
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// this gives the individual icons we want to use
import {
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';
```
```ts
imports: [
    /* existing imports */
    FontAwesomeModule
],
```
```ts
icons = {
    // The below is just ES2015+ short for faCheckCircle: faCheckCircle,
    faCheckCircle,
    faTimesCircle,
};
```
- Add it below the location details in `src/app/workshops/workshop-details/workshop-details.component.html`
```html
<div>{{ workshop.location | location }}</div>

<!-- Add this -->
<div>
    <span class="me-4">
        <fa-icon
            [icon]="
                workshop.modes.inPerson
                    ? icons.faCheckCircle
                    : icons.faTimesCircle
            "
        ></fa-icon>
        In person
    </span>
    <span>
        <fa-icon
            [icon]="
                workshop.modes.online
                    ? icons.faCheckCircle
                    : icons.faTimesCircle
            "
        ></fa-icon>
        Online
    </span>
</div>
```
- You can make the code above a bit cleaner. First add this method in `src/app/workshops/workshop-details/workshop-details.component.ts`. TypeScript `keyof` creates a union of keys of an object type (here `keyof IModes` creates `'inPerson' | 'online'`). Note that `IModes` is a named export (and not a default export) - hence the `{}` when importing it.
```ts
import { IModes } from '../models/IWorkshop';
```
```ts
getIconForMode(mode: keyof IModes) {
    return this.workshop.modes[mode]
        ? this.icons.faCheckCircle
        : this.icons.faTimesCircle;
}
```
- Then update `src/app/workshops/workshop-details/workshop-details.component.html` to make use of the method like so
```html
<div>
    <span class="me-4">
        <fa-icon [icon]="getIconForMode('inPerson')"></fa-icon>
        In person
    </span>
    <span>
        <fa-icon [icon]="getIconForMode('online')"></fa-icon>
        Online
    </span>
</div>
```

## Step 24: Add child routing to show session list / add session form based on the child route
- Child routes add on the the parent route and are used to show one of a set of children components conditionally in a parent component. We will show sessions list below the workshop details if the URL is `http://localhost:4200/workshops/:id` (adds nothing to the parent route), and the add session form below the workshop details if the URL is `http://localhost:4200/workshops/:id/add-session` (Adds 'add-session' to the parent route).
- Create 2 components to be used as children in workshop details component
```
ng g c workshops/workshop-details/sessions-list
ng g c workshops/workshop-details/add-session
```
- Add routes for these (child routing). Note the use of `children`, and how we need to mention only what needs to be added to the parent route in their paths. In `src/app/workshops/workshops.routes.ts`,
```ts
import { SessionsListComponent } from './workshop-details/sessions-list/sessions-list.component';
import { AddSessionComponent } from './workshop-details/add-session/add-session.component';
```
```ts
{
    path: 'workshops/:id',
    component: WorkshopDetailsComponent,
    title: 'Workshop Details',
    children: [
        {
            path: '', // same as parent route as nothing is to be added to that route
            component: SessionsListComponent,
        },
        {
            path: 'add-session',
            component: AddSessionComponent,
        },
    ],
}
```
- Add the following in `src/app/workshops/workshop-details/workshop-details.component.ts`, in order to use `RouterOutlet`
```ts
import { ActivatedRoute, RouterOutlet, RouterLink } from '@angular/router';
```
```ts
imports: [
    /* existing imports */
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
]
```
- Add a router-outlet in `src/app/workshops/workshop-details/workshop-details.component.html`, in order to show one of the children based on the route. Also add `routerLink`s to switch between children.

```html
<div class="mt-5">
    <!-- Alternatively, [routerLink]="['.']" -->
    <button
        [routerLink]="['/workshops', workshop.id]"
        routerLinkActive="btn-active"
        [routerLinkActiveOptions]="{ exact: true }"
        class="btn btn-primary btn-sm btn-child-link me-2"
    >
        Sessions List
    </button>
    <!-- Alternatively, [routerLink]="['add-session']" -->
    <button
        [routerLink]="['/workshops', workshop.id, 'add-session']"
        routerLinkActive="btn-active"
        [routerLinkActiveOptions]="{ exact: true }"
        class="btn btn-primary btn-sm btn-child-link"
    >
        Add a session
    </button>
</div>

<!-- The router will decide whether to show sessions list / add session component, and show it here -->
<div class="my-4">
    <router-outlet></router-outlet>
</div>
```
- In `src/app/workshops/workshop-details/workshop-details.component.scss`,
```scss
.btn-child-link {
    opacity: 0.5;
}

.btn-active {
    opacity: 1;
}
```
- You can now switch between the child routes using the links.

## Step 25: Fetch and show sessions for the workshop
- In `src/app/workshops/models/ISession.ts` define the model to represent a session
```ts
type Level = 'Basic' | 'Intermediate' | 'Advanced';

interface ISession {
    id: number;
    workshopId: number;
    sequenceId: number;
    name: string;
    speaker: string;
    duration: number;
    level: Level;
    abstract: string;
    upvoteCount: number;
}

export type {
    Level,
    ISession as default
};
```
- The general practice is to create a service for every REST resource (roughly an database entity in the backend). Create the service `src/app/workshops/sessions.service.ts` and define the service method to fetch sessions for the workshop with a given id.
```
ng g s workshops/sessions
```
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import ISession from './models/ISession';

@Injectable({
    providedIn: 'root',
})
export class SessionsService {
    constructor(private http: HttpClient) {}

    getSessionsForWorkshop(workshopId: number) {
        return this.http.get<ISession[]>(
            `https://workshops-server.onrender.com/workshops/${workshopId}/sessions`
        );
    }
}
```
- In `src/app/workshops/workshop-details/sessions-list/sessions-list.component.ts` fetch the sessions. Note how we used `ActivatedRoute::snapshot` as an alternative to using the `ActivatedRoute::paramMap` Observable.
```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from '../../sessions.service';
import ISession from '../../models/ISession';

@Component({
    selector: 'app-sessions-list',
    standalone: true,
    imports: [],
    templateUrl: './sessions-list.component.html',
    styleUrl: './sessions-list.component.scss',
})
export class SessionsListComponent implements OnInit {
    workshopId!: number;
    sessions!: ISession[];

    constructor(
        private sessionsService: SessionsService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        // this.activatedRoute.snapshot.paramMap is NOT an observable unlike this.activatedRoute.paramMap which is an observable
        const idStr = this.activatedRoute.snapshot.paramMap.get('id');
        this.workshopId = +(idStr as string);

        this.sessionsService.getSessionsForWorkshop(this.workshopId).subscribe({
            next: (sessions) => {
                this.sessions = sessions;
            },
        });
    }
}
```
- Display the sessions in `src/app/workshops/workshop-details/sessions-list/sessions-list.component.html`
```html
<h2>List of sessions</h2>

<hr />

<ul class="list-group">
    @for( s of sessions; track s.id ) {
        <li class="list-group-item">
            <div class="row">
                <div
                    class="col-1 d-flex flex-column justify-content-center align-items-center"
                >
                    <!-- @todo voting widget -->
                </div>
                <div class="col-11">
                    <h3>{{ s.name }}</h3>
                    <div>by {{ s.speaker }}</div>
                    <div>{{ s.level }}</div>
                    <div>{{ s.duration }}</div>
                    <div>{{ s.abstract }}</div>
                </div>
            </div>
        </li>
    }
</ul>
```
- __EXERCISE__: Handle the loading and error states. Also move the display of sessions list items to a separate component (just the way we handled workshops list items). The solution is mentioned at the end of Step 26.

## Step 26: Create a voting widget component and use it for voting on a session
- Create the service method to vote on a session in `src/app/workshops/sessions.service.ts`
```ts
export type VoteType = 'upvote' | 'downvote';
```
```ts
voteForSession(sessionId: number, voteType: VoteType) {
    return this.http.put<ISession>(
        `https://workshops-server.onrender.com/sessions/${sessionId}/${voteType}`,
        null // we generally pass data in put request. In this case we don't have any data
    );
}
```
- Create the voting widget component that will be useful for showing votes and providing voting buttons where needed. It takes `votes` as an input, and fires events when the upvote or downvote buttons are clicked.
```
ng g c common/voting-widget
```
- In `src/app/common/voting-widget/voting-widget.component.ts`
```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-voting-widget',
    standalone: true,
    imports: [FontAwesomeModule],
    templateUrl: './voting-widget.component.html',
    styleUrl: './voting-widget.component.scss',
})
export class VotingWidgetComponent {
    icons = {
        faCaretUp,
        faCaretDown,
    };

    @Input()
    votes!: number;

    // The emitted event will pass to the parent how much to change the vote by (+1, -2 etc.)
    @Output()
    vote = new EventEmitter<number>();

    emitVote(by: number) {
        this.vote.emit(by);
    }
}
```
- In `src/app/common/voting-widget/voting-widget.component.html`,
```html
<fa-icon
    [icon]="icons.faCaretUp"
    (click)="emitVote(1)"
    size="2x"
    style="color: green; cursor: pointer"
></fa-icon>
<span class="upvoteCount">{{ votes }}</span>
<fa-icon
    [icon]="icons.faCaretDown"
    (click)="emitVote(-1)"
    size="2x"
    style="color: red; cursor: pointer"
></fa-icon>
```
- In `src/app/common/voting-widget/voting-widget.component.scss`,
```scss
:host {
    display: flex;
    flex-direction: column;
    align-items: center;
}
```
- Use the voting widget component in `src/app/workshops/workshop-details/sessions-list/sessions-list.component.ts`. Pass down `votes` to the widget, and listen for the `vote` event.
```ts
import { VotingWidgetComponent } from '../../../common/voting-widget/voting-widget.component';
import ISession from '../../models/ISession';
```
```ts
imports: [VotingWidgetComponent],
```
- In `src/app/workshops/workshop-details/sessions-list/sessions-list.component.html`,
```html
<div
    class="col-1 d-flex flex-column justify-content-center align-items-center"
>
    <app-voting-widget
        [votes]="s.upvoteCount"
        (vote)="updateVote(s, $event)"
    ></app-voting-widget>
</div>
```
- Handle the `vote` event in `src/app/workshops/workshop-details/sessions-list/sessions-list.component.ts`. Note how we update the votes for the session being operated on. Since this session object is the exact one being used in the HTML (As part of the `sessions` array), Angular's data-binding is able to detect the change and update the UI!
```ts
updateVote(session: ISession, by: number) {
    this.sessionsService
        .voteForSession(session.id, by === 1 ? 'upvote' : 'downvote')
        .subscribe({
            next: (updatedSession) => {
                session.upvoteCount = updatedSession.upvoteCount;
            },
            // @todo handle error
        });
}
```

### Exercise solution (from Step 25)
- In `src/app/workshops/workshop-details/sessions-list/sessions-list.component.ts`
```ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sessions } from '../../sessions';
import ISession from '../../models/ISession';
import { Toast as ToastService } from '../../../common/toast';

import { LoadingSpinner } from '../../../common/loading-spinner/loading-spinner';
import { ErrorAlert } from '../../../common/error-alert/error-alert';
import { Item } from './item/item';

@Component({
    selector: 'app-sessions-list',
    standalone: true,
    imports: [
        LoadingSpinner,
        ErrorAlert,
        Item
    ],
    templateUrl: './sessions-list.html',
    styleUrl: './sessions-list.scss',
})
export class SessionsList implements OnInit {
    loading = true;
    error : Error | null = null;
    workshopId!: number;
    sessions!: ISession[];

    private toastService = inject(ToastService);

    constructor(
        private sessionsService: Sessions,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        // this.activatedRoute.snapshot.paramMap is NOT an observable unlike this.activatedRoute.paramMap which is an observable
        const idStr = this.activatedRoute.snapshot.paramMap.get('id');
        this.workshopId = +(idStr as string);

        this.loading = true;
        this.sessionsService.getSessionsForWorkshop(this.workshopId).subscribe({
            next: (sessions) => {
                this.sessions = sessions;
                this.loading = false;
            },
            error: (err) => {
                this.error = err;
                this.loading = false;
            }
        });
    }

    updateVote(session: ISession, by: number) {
    this.sessionsService
        .voteForSession(session.id, by === 1 ? 'upvote' : 'downvote')
        .subscribe({
            next: (updatedSession) => {
                session.upvoteCount = updatedSession.upvoteCount;
                alert(`Your vote for ${session.name} has been captured`);
            },
            error: (err) => {
                alert(`Your vote for ${session.name} could not be captured (${err.message}). Try again.`);
            }
        });
    }
}
```
- In `src/app/workshops/workshop-details/sessions-list/sessions-list.component.html`
```html
<h2>List of sessions</h2>

<hr />

@if(loading) {
    <app-loading-spinner variant="success"></app-loading-spinner>
} @else if( !loading && error ) {
    <!--
        parent gets hold o the new page and calls its own changePage()
    -->
    <app-error-alert [error]="error"></app-error-alert>
} @else {
    <ul class="list-group">
        @for( s of sessions; track s.id ) {
            <li class="list-group-item">
                <app-item
                    [session]="s"
                    (updateVote)="updateVote(s, $event)"
                />
            </li>
        }
    </ul>
}
```
- In `src/app/workshops/workshop-details/sessions-list/item/item.component.ts`
```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import ISession from '../../../models/ISession';
import { VotingWidget } from '../../../../common/voting-widget/voting-widget';

@Component({
  selector: 'app-item',
  imports: [
    VotingWidget
  ],
  templateUrl: './item.html',
  styleUrl: './item.scss'
})
export class Item {
  @Input()
  session!: ISession;

  @Output('updateVote')
  updateVote = new EventEmitter<number>();

  updateSessionVote($event: number) {
    this.updateVote.emit($event);
  }
}
```
- In `src/app/workshops/workshop-details/sessions-list/item/item.component.html`
```html
<div class="row">
    <div
        class="col-1 d-flex flex-column justify-content-center align-items-center"
    >
        <div
            class="col-1 d-flex flex-column justify-content-center align-items-center"
        >
            <app-voting-widget
                [votes]="session.upvoteCount"
                (vote)="updateSessionVote($event)"
            ></app-voting-widget>
        </div>
    </div>
    <div class="col-11">
        <h3>{{ session.name }}</h3>
        <div>by {{ session.speaker }}</div>
        <div>{{ session.level }}</div>
        <div>{{ session.duration }}</div>
        <div>{{ session.abstract }}</div>
    </div>
</div>
```


## Step 27: Using environment files for enabling environment-based settings
- Environment files help us to use settings for the application based on the environment. We can, for example, have our code work without changes, and comunicate with a local development server in development, and a production server, in a production environment. Angular will take care to use the appropriate settings based on the application build (development/staging/production etc.)
- In `src/environments/environment.ts`
```ts
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8001',
};
```
- In `src/environments/environment.production.ts`
```ts
export const environment = {
    production: true,
    apiUrl: 'https://workshops-server.onrender.com',
};
```
- Configure Angular CLI (`ng`) to use the appropriate file based on the build (development/staging/production etc.). In the build command configuration for production environment in the file `angular.json`,
```json
"outputHashing": "all",
"fileReplacements": [
    {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.production.ts"
    }
]
```
- Do necessary changes in `src/app/workshops/workshops.service.ts`
```ts
import { environment } from '../../environments/environment';
```
```ts
export class WorkshopsService {
    private apiUrl = environment.apiUrl;

    // rest of code...
}
```
```ts
getWorkshops(page: number = 1) {
    return this.http.get<IWorkshop[]>(`${this.apiUrl}/workshops`, {
        params: {
            _page: page,
        },
    });
}

getWorkshopById(workshopId: number) {
    return this.http.get<IWorkshop>(
        `${this.apiUrl}/workshops/${workshopId}`
    );
}
```
- Do necessary changes in `src/app/workshops/sessions.service.ts`
```ts
import { environment } from '../../environments/environment';
```
```ts
export class SessionsService {
    private apiUrl = environment.apiUrl;

    // rest of code...
}
```
```ts
getSessionsForWorkshop(workshopId: number) {
    return this.http.get<ISession[]>(
        `${this.apiUrl}/workshops/${workshopId}/sessions`
    );
}

voteForSession(sessionId: number, voteType: VoteType) {
    return this.http.put<ISession>(
        `${this.apiUrl}/sessions/${sessionId}/${voteType}`,
        null
    );
}
```
- To test the correct usage of settings in a production environment, add a script in `package.json` `scripts` to start the Angular app frontend server in a production environemt
```json
"start:production": "ng serve --configuration production",
```
- Start the Angular app in production mode
```
npm run start:production
```
- Verify from the network tab that the production backend is the one being used in HTTP request now.

## Step 28: Set up a toast message service and container to display toast messages
- Create a service to hold toast messages to be displayed, and methods to add and remove toasts
```
ng g s common/toast
```
- In `src/app/common/toast/toast.service.ts`,
```ts
import { Injectable } from '@angular/core';

interface IToast {
    message: string;
    className: string;
    duration: number;
}

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    // shared data - the list of toast messages
    private toasts: IToast[] = [];

    constructor() {}

    getToasts() {
        return this.toasts;
    }
    
    add(toast: IToast) {
        this.toasts.unshift(toast);
    }
    
    remove(toast: IToast) {
        // filter() does not modify this.toasts, it only returns a new Array. So we need to reassign the result to this.toasts
        this.toasts = this.toasts.filter((t) => t !== toast);
    }
    
    clear() {
        this.toasts = [];
    }
}
```
- Create an associated toast component
```
ng g c common/toast
```
- In `src/app/common/toast/toast.component.ts` add the following. We have already used constructor DI many times. Now we see a new way (using `inject()`) that works with functions as well (apart from classes).
```ts
import { Component, inject } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './toast.service';
```
```ts
imports: [NgbToastModule],
```
```ts
export class ToastComponent {
    // Angular 17 Introduced this way on service injection
    public toastService = inject(ToastService);
}
```
- In `src/app/common/toast/toast.component.html`,
```html
@for( toast of toastService.getToasts(); track toast ) {
    <ngb-toast
        class="mb-3"
        [class]="toast.className"
        [autohide]="true"
        [delay]="toast.duration || 5000"
        (hidden)="toastService.remove(toast)"
    >
        {{ toast.message }}
    </ngb-toast>
}
```
- In `src/app/common/toast/toast.component.scss`,
```scss
:host {
    position: fixed;
    top: 50px;
    right: 0px;
    padding: 20px;
    z-index: 1000;
}
```
- Render a toast component instance (that acts as the container for toast messages) in `src/app/app.component.ts`
```ts
import { ToastComponent } from './common/toast/toast.component';
```
```ts
imports: [
    /* existing imports */
    ToastComponent,
],
```
- In `src/app/app.component.html`
```html
<!-- Add this -->
<app-toast></app-toast>

<app-menu></app-menu>
```

## Step 29: Set up options for editing / deleting a workshop in every workshop list item
- In `src/app/workshops/workshops-list/item/item.component.ts`,
```ts
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
```
```ts
imports: [
    /* existing imports */
    FontAwesomeModule
],
```
```ts
export class ItemComponent {
    icons = {
        faPencil,
        faTrash,
    };

    /* rest of code */
}
```
- In `src/app/workshops/workshops-list/item/item.component.scss`,
```scss
:host {
    display: flex;
    position: relative;
}

.card-action-buttons {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 16px;

    .btn-action-button {
        cursor: pointer;
        opacity: 0.7;
        
        &:hover {
            opacity: 1;
        }
    }
}
```
- In `src/app/workshops/workshops-list/item/item.component.html`,
```html
@if( workshop !== null ) {
    <div class="card p-3">
        <div class="card-action-buttons">
            <button class="me-2 btn btn-info btn-sm btn-action-button" title="Edit this workshop">
                <fa-icon [icon]="icons.faPencil"></fa-icon>
            </button>
            <button class="btn btn-danger btn-sm btn-action-button" title="Delete this workshop">
                <fa-icon [icon]="icons.faTrash"></fa-icon>
            </button>
        </div>
        
        <!-- rest of UI... -->
    </div>
}
```

## Step 30: Deleting a workshop
- In `src/app/workshops/workshops-list/item/item.component.html`,
```html
<button
    class="btn btn-danger btn-sm"
    title="Delete this workshop"
    (click)="onDeleteWorkshop()"
>
    <fa-icon [icon]="icons.faTrash"></fa-icon>
</button>
```
- In `src/app/workshops/workshops-list/item/item.component.ts`, set up a `delete` event to inform to the parent when user clicks on the delete icon.
```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
```
```ts
@Output()
delete = new EventEmitter();

onDeleteWorkshop() {
    this.delete.emit();
}
```
- In the parent component `src/app/workshops/workshops-list/workshops-list.component.html`,
```html
<app-item [workshop]="workshop" (delete)="deleteWorkshop(workshop)"></app-item>
```
- In `src/app/workshops/workshops-list/workshops-list.component.ts`
```ts
deleteWorkshop(workshop: IWorkshop) {
    console.log(workshop);
}
```
- The workshop is now logged in the console when the user tries to delete the workshop
- Add a service method to delete a workshop with a given id in `src/app/workshops/workshops.service.ts`. Note that we use void to indicate an empty-bodied response.
```ts
deleteWorkshopById(workshopId: number) {
    return this.http.delete<void>(`${this.apiUrl}/workshops/${workshopId}`);
}
```
- Use this in `src/app/workshops/workshops-list/workshops-list.component.ts` to delete a workshop.
```ts
import { ToastService } from '../../common/toast/toast.service';
```
```ts
constructor(
        private workshopsService: WorkshopsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService
) { }
```
```ts
deleteWorkshop(workshop: IWorkshop) {
    console.log(workshop);

    this.workshopsService.deleteWorkshopById(workshop.id).subscribe({
        next: () => {
            this.toastService.add({
                message: `Deleted workshop with id = ${workshop.id}`,
                className: 'bg-success text-light',
                duration: 5000,
            });
            // update this.workshops
            this.workshops = this.workshops.filter(
                (w) => w.id !== workshop.id
            );
        },
        error: () => {
            this.toastService.add({
                message: `Could not delete workshop with id = ${workshop.id}`,
                className: 'bg-danger text-light',
                duration: 5000,
            });
        },
    });
}
```
- In order to display a confirmation dialog before deletion, we add this in `src/app/workshops/workshops-list/workshops-list.component.ts`. Here, `content` of type `TemplateRef<any>` is a reference to a element node representing the modal dialog (the reference is obtained using a template reference variable). `ng-template` is simply a container element that does not render as an actual HTML element and instead renders the contents within in the browser. Y
```ts
import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
```
```ts
constructor(
    private workshopsService: WorkshopsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private modalService: NgbModal
) { }
```
```ts
open(content: TemplateRef<any>, workshop: IWorkshop) {
    this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
            (result) => {
                if (result === 'ok') {
                    this.deleteWorkshop(workshop);
                }
            }
            // (reason) => { // on modal.dismiss() - eg. when the dalog is simply closed
            // }
        );
}
```
- In `src/app/workshops/workshops-list/workshops-list.component.html`,
```html
<app-item
    [workshop]="workshop"
    (delete)="open(content, workshop)"
></app-item>
```
```html
<ng-template #content let-modal>
    <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">
            Please confirm deletion!
        </h4>
        <button
            type="button"
            class="btn-close"
            aria-label="Close"
            (click)="modal.dismiss('close')"
        ></button>
    </div>
    <div class="modal-body">
        <div class="mb-3">
            You are about to delete a workshop. This action cannot be undone.
            Are you sure want to proceed?
        </div>
        <div>
            <button class="btn btn-light" (click)="modal.close('cancel')">
                Cancel
            </button>
            <button class="btn btn-danger" (click)="modal.close('ok')">
                OK
            </button>
        </div>
    </div>
</ng-template>
```

## Step 31: Create the form to add a session
- In `src/app/workshops/workshop-details/add-session/add-session.component.html`,
```html
<div class="d-flex justify-content-between align-items-center">
    <h2 class="my-3">Add a session</h2>
    <button class="btn btn-primary" id="list-sessions">List of sessions</button>
</div>

<hr />

<form id="add-session-form">
    <div class="mb-3">
        <label for="sequenceId" class="form-label">Sequence ID</label>
        <input type="text" class="form-control" id="sequenceId" />
        <div class="error-message"></div>
    </div>
    <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" />
    </div>
    <div class="mb-3">
        <label for="speaker" class="form-label">Speaker</label>
        <input type="text" class="form-control" id="speaker" />
    </div>
    <div class="mb-3">
        <label for="duration" class="form-label">Duration</label>
        <input type="number" class="form-control" id="duration" />
    </div>
    <div class="mb-3">
        <label for="level" class="form-label">Level</label>
        <select class="form-select" id="level">
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="abstract" class="form-label">Abstract</label>
        <textarea class="form-control" id="abstract" rows="3"></textarea>
    </div>
    <div class="mb-3">
        <button class="btn btn-primary">Add session</button>
    </div>
</form>
```
- In `src/styles.scss`, add this. We add it to global styles as similar error messages will need to be displayed in other forms in the app.
```scss
.error-message {
    color: crimson;
    font-size: 0.85em;
}
```

## Step 32: Validation using template-driven forms approach
- There are 2 ways of working with forms in Angular
    - Template-driven - for simple forms, simple form handling and simple validations
    - Reactive
- We start with the template-driven approach.
- __Reference__: https://angular.dev/guide/forms/template-driven-forms
- In `src/app/workshops/workshop-details/add-session/add-session.component.ts` add the following. `FormsModule` provides `NgModel` directive and JsonPipe is used for displaying JavaScript objects in the UI (used generally for debugging purposes).
```ts
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
```
```ts
imports: [FormsModule, JsonPipe],
```
- Do the following changes in `src/app/workshops/workshop-details/add-session/add-session.component.html`. Once we add the `ngModel` directive to an input, Angular maintains an `NgModel` object that holds the user input, the validity status (based on attributes like `required`, `pattern`, `min`, `max` etc. that we set on the input), the touched, dirty status etc. `#var` set on a DOM element is called a template reference variable. The template reference variable by default refers to the DOM node. Set it to `ngModel` to get a reference to the `NgModel` object instead.
```html
<input
    type="text"
    class="form-control"
    id="sequenceId"
    name="sequenceId"
    required
    pattern="\d+"
    ngModel
    #sequenceId="ngModel"
    autocomplete="off"
/>
<!-- Note how the JSON pipe is used for inspecting objects and thus useful for debugging! -->
{{ sequenceId.errors | json }}
{{ sequenceId.value }}
<div>{{ "sequenceId.invalid = " + sequenceId.invalid }}</div>
<div>{{ "sequenceId.valid = " + sequenceId.valid }}</div>
<div>{{ "sequenceId.dirty =" + sequenceId.dirty }}</div>
<div>{{ "sequenceId.touched =" + sequenceId.touched }}</div>
@if( sequenceId.invalid && ( sequenceId.touched || sequenceId.dirty ) && sequenceId.errors ) {
    <div class="error-message">
        There is some error
    </div>
}
```
```html
<input type="text" class="form-control" id="name" required />
```
```html
<input type="text" class="form-control" id="speaker" required />
```
```html
<input type="number" class="form-control" id="duration" required />
```
```html
<select class="form-select" id="level" required>
    <option value="Basic">Basic</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
</select>
```
```html
<textarea
    class="form-control"
    id="abstract"
    rows="3"
    required
></textarea>
```
- __EXERCISE__: Set up error handling for rest of the inputs as well.
- We now display error messages based on the type of error that occured.
```html
@if( sequenceId.invalid && ( sequenceId.touched || sequenceId.dirty ) && sequenceId.errors ) {
    <div class="error-message">
        @if(sequenceId.errors['required']) {
            <div>This is required</div>
        } @if(sequenceId.errors['pattern']) {
            <div>Provide a number</div>
        }
    </div>
}
```
```html
<input
    type="text"
    class="form-control"
    id="name"
    name="name"
    required
    pattern="[A-Z][A-Za-z ]+"
    ngModel
    #name="ngModel"
/>
@if( name.invalid && ( name.touched || name.dirty ) && name.errors ) {
    <div class="error-message">
        @if(name.errors['required']) {
            <div>This is required</div>
        } @if(name.errors['pattern']) {
            <div>Provide a valid name (only letters and spaces)</div>
        }
    </div>
}
```
```html
<input
    type="text"
    class="form-control"
    id="speaker"
    name="speaker"
    required
    pattern="[A-Z][A-Za-z ]+(,[A-Z ][A-Za-z ]+)*"
    ngModel
    #speaker="ngModel"
/>
@if( speaker.invalid && ( speaker.touched || speaker.dirty ) && speaker.errors ) {
    <div class="error-message">
        @if(speaker.errors['required']) {
            <div>This is required</div>
        } @if(speaker.errors['pattern']) {
            <div>
                Provide valid names (only letters and spaces for names, and separate names by commas)
            </div>
        }
    </div>
}
```
```html
<input
    type="number"
    class="form-control"
    id="duration"
    name="duration"
    required
    min="0.5"
    max="10"
    ngModel
    #duration="ngModel"
/>
@if( duration.invalid && ( duration.touched || duration.dirty ) && duration.errors ) {
    <div class="error-message">
        @if(duration.errors['required']) {
            <div>This is required</div>
        } @if(duration.errors['min']) {
            <div>Duration is minimum 0.5</div>
        } @if(duration.errors['max']) {
            <div>Duration is maximum 10</div>
        }
    </div>
}
```
```html
<select
    class="form-select"
    id="level"
    name="level"
    required
    ngModel
    #level="ngModel"
>
    <option value="Basic">Basic</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
</select>
@if( level.invalid && ( level.touched || level.dirty ) && level.errors ) {
    <div class="error-message">
        @if(level.errors['required']) {
        <div>This is required</div>
        }
    </div>
}
```
```html
<textarea
    class="form-control"
    id="abstract"
    name="abstract"
    rows="3"
    required
    minlength="20"
    ngModel
    #abstract="ngModel"
></textarea>
@if( abstract.invalid && ( abstract.touched || abstract.dirty ) && abstract.errors ) {
    <div class="error-message">
        @if(abstract.errors['required']) {
            <div>This is required</div>
        } @if(abstract.errors['minlength']) {
            <div>Minimum 20 characters needed</div>
        }
    </div>
}
```

## Step 33: Handle form submission and add the session
- In `src/app/workshops/sessions.service.ts`,
```ts
addSession(session: Omit<ISession, 'id'>) {
    return this.http.post<ISession>(`${this.apiUrl}/sessions`, session, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
```
- Just like Angular maintains an `NgModel` instance for every input on which the directive is set, it maintains an `NgForm` instance on every form (no need to add any directive to the form though). This has validation and user interaction states for the form (similar to the ones for inputs with `NgModel`). The form is invalid if at least one form input within it, tracked by `NgModel`, is invalid. The form is dirty if at least one input tracked is dirty, etc. We disable form submission if the form is invalid. On submission we call `addSession()` passing it the instance of `NgForm`. In `src/app/workshops/workshop-details/add-session/add-session.component.html`,
```html
<form id="add-session-form" #addSessionForm="ngForm" (ngSubmit)="addSession(addSessionForm)">
    <div>valid = {{ addSessionForm.valid | json }}</div>
    <div>invalid = {{ addSessionForm.invalid | json }}</div>
    <div>value = {{ addSessionForm.value | json }}</div>
    <div>dirty = {{ addSessionForm.dirty | json }}</div>
    ...
    <button class="btn btn-primary" [disabled]="addSessionForm.invalid">
        Add session
    </button>
</form>
```
- Handle the form submission in `src/app/workshops/workshop-details/add-session/add-session.component.ts`. Note how we need to go the `ActivatedRoute::snapshot.parent` to get the `id` value as this child route is not the same as the parent route (it has `/add-session` extra). Note also how the `Router` service is used for programmatic navigaton (client-side redirection).
```ts
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionsService } from '../../sessions.service';
import ISession from '../../models/ISession';
```
```ts
export class AddSessionComponent {
    constructor(
        private activatedRoute: ActivatedRoute,
        private sessionsService: SessionsService,
        private router: Router
    ) {}

    addSession(addSessionForm: NgForm) {
        const id = +(this.activatedRoute.snapshot.parent?.paramMap.get(
            'id'
        ) as string);

        const newSession = {
            ...addSessionForm.value,
            workshopId: id,
            upvoteCount: 0,
            sequenceId: +addSessionForm.value.sequenceId,
            duration: +addSessionForm.value.duration,
        } as Omit<ISession, 'id'>;

        console.log(newSession);
        
        this.sessionsService.addSession(newSession).subscribe({
            next: (addedSession) => {
                alert(`Added session with id = ${addedSession.id}`);
                
                // You can also use navigateByUrl()
                this.router.navigate(['/workshops', id]);
            },
        });
    }
}
```
- Fill the form correctly, submit it, and verify that the session in added in the backend.

## Step 34: Use the toast service to display toast after trying to add a session
- In `src/app/workshops/workshop-details/add-session/add-session.component.ts`
```ts
import { ToastService } from '../../../common/toast/toast.service';
```
```ts
constructor(
    private activatedRoute: ActivatedRoute,
    private sessionsService: SessionsService,
    private router: Router,
    private toastService: ToastService
) {}
```
```ts
this.sessionsService.addSession(newSession).subscribe({
    next: (addedSession) => {
        this.toastService.add({
            message: `Added session with id = ${addedSession.id}`,
            className: 'bg-success text-light',
            duration: 5000,
        });

        // You can also use navigateByUrl()
        this.router.navigate(['/workshops', id]);
    },
    error: (error) => {
        this.toastService.add({
            message: `Unable to add the session - ${error.message}`,
            className: 'bg-danger text-light',
            duration: 5000,
        });
    },
});
```

## Step 35: Handle form validation to add the session using the reactive form approach
- __Note__: You can take a backup copy of `src/app/workshops/workshop-details/add-session` as `src/app/workshops/workshop-details/add-session-template-driven` (for example).
- In `src/app/workshops/workshop-details/add-session/add-session.component.ts` create the `FormGroup` with `FormControl`s for each tracked input. Define initial value for the inputs and validations. The ReactiveFormModule provides a completely different set of directives to be used in the HTML template (`formGroup`, `formControl`, `formControlName`, `formArrayName` etc.)
- __Reference__: https://angular.dev/guide/forms/reactive-forms
```ts
import {
    ReactiveFormsModule,
    NgForm,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
```
```ts
imports: [
    /* existing imports */
    ReactiveFormsModule
],
```
```ts
export class AddSessionComponent {
    addSessionForm = new FormGroup({
        sequenceId: new FormControl(
            '', // initial value of the input
            [
                // the list of validators
                Validators.required,
                Validators.pattern('\\d+'),
            ],
        ),
        name: new FormControl(
            '',
            [Validators.required, Validators.pattern('[A-Z][A-Za-z ]+')],
        ),
        speaker: new FormControl(
            '',
            [
                Validators.required,
                Validators.pattern('[A-Z][A-Za-z ]+(,[A-Z ][A-Za-z ]+)*'),
            ],
        ),
        duration: new FormControl(
            '',
            [Validators.required, Validators.min(0.5), Validators.max(10)],
        ),
        level: new FormControl(
            '',
            [Validators.required]
        ),
        abstract: new FormControl(
            '',
            [Validators.required, Validators.minLength(2)],
        ),
    });
    
    // helper accessor methods
    get sequenceId() {
        return this.addSessionForm.get('sequenceId') as FormControl;
    }
    
    get name() {
        return this.addSessionForm.get('name') as FormControl;
    }
    
    get speaker() {
        return this.addSessionForm.get('speaker') as FormControl;
    }
    
    get duration() {
        return this.addSessionForm.get('duration') as FormControl;
    }
    
    get level() {
        return this.addSessionForm.get('level') as FormControl;
    }
    
    get abstract() {
        return this.addSessionForm.get('abstract') as FormControl;
    }
    
    constructor(
        private activatedRoute: ActivatedRoute,
        private sessionsService: SessionsService,
        private router: Router,
        private toastService: ToastService
    ) {}

    // NOTE: Only the signature of this method changes fron the template-driven code written earlier.
    addSession() {
        // existing code as is...
    }
}
```
- In `src/app/workshops/workshop-details/add-session/add-session.component.html`, make the following changes. In reactive forms approach, we do not use ngModel, and instead use other directives. So we must remove ngModel and the template variable created for every input. Since validations are set up in the model we have set up in the component class, we remove these as well from the inputs.
```html
<form
    id="add-session-form"
    (ngSubmit)="addSession()"
    [formGroup]="addSessionForm"
    novalidate
>
    ...
</form>
```
```html
<input
    type="text"
    class="form-control"
    id="sequenceId"
    name="sequenceId"
    formControlName="sequenceId"
    autocomplete="off"
/>
```
- __EXERCISE__: Do similarly for the rest of the inputs as well.

## Step 36: Using Form Builder
- The Form Builder service provides an alternative to using FormGroup, FormControl classes directly, but with less boilerplate code.
- In ``,
```ts
import { /* existing imports */, FormBuilder } from '@angular/forms';
```
```ts
export class AddSessionComponent {
    addSessionForm!: FormGroup;
}
```
```ts
constructor(
    private activatedRoute: ActivatedRoute,
    private sessionsService: SessionsService,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder
) {
    this.addSessionForm = this.fb.group({
        sequenceId: [
            '', // initial value of the input
            [
                // the list of validators
                Validators.required,
                Validators.pattern('\\d+'),
            ],
        ],
        name: [
            '',
            [Validators.required, Validators.pattern('[A-Z][A-Za-z ]+')],
        ],
        speaker: [
            '',
            [
                Validators.required,
                Validators.pattern('[A-Z][A-Za-z ]+(,[A-Z ][A-Za-z ]+)*'),
            ],
        ],
        duration: [
            '',
            [Validators.required, Validators.min(0.5), Validators.max(10)],
        ],
        level: ['', [Validators.required]],
        abstract: ['', [Validators.required, Validators.minLength(20)]],
    });
}
```

## Step 37: Setting up custom and cross-field validations
- In `src/app/workshops/workshop-details/add-session/add-session.component.ts`,
```ts
import { /* existing imports */, AbstractControl } from '@angular/forms';
```
- Set `durationAndLevel()` as a standalone function (outside the class)
```ts
function durationAndLevel(form: AbstractControl) {
    const durationStr = (form.get('duration') as AbstractControl).value;
    const duration = +durationStr;
    const level = (form.get('level') as AbstractControl).value;
    
    // if valid -> return null
    // if invalid -> return an object with the details of the error. Further this object should have the property called `durationAndLevel`
    if (durationStr === '' || level === '') {
        return null;
    }
    
    if (level === 'Basic') {
        return null;
    }
    
    if (level === 'Intermediate') {
        if (duration >= 2) {
            return null;
        }
        
        // error
        return {
            durationAndLevel: 'Intermediate level session should be at least 2 hours in duration',
        };
    }

    if (level === 'Advanced') {
        if (duration >= 3) {
            return null;
        }

        // error
        return {
            durationAndLevel: 'Advanced level session should be at least 3 hours in duration',
        };
    }

    return null;
}
```
```ts
this.addSessionForm = this.fb.group(
    { ... }, 
    {
        validators: durationAndLevel,
    }
);
```
- In `src/app/workshops/workshop-details/add-session/add-session.component.html`,
```html
<form ...>
    <div class="mb-3 error-message">
        @if( addSessionForm.errors && addSessionForm.errors['durationAndLevel']
        ) {
            <div>{{ addSessionForm.errors["durationAndLevel"] }}</div>
        }
    </div>
    <!--  rest of form -->
</form>
```

## Step 38: Getting started with a form to add a workshop
- __EXERCISE__: In `src/app/workshops/add-workshop/add-workshop.component.ts` import `FormGroup`. Do necessary set up for a form to add a new workshop. Group address, city, state under a separate FormGroup as "location". Group the 2 checkboxes under "modes". Set up validations using reactive forms approach. Set the ReactiveFormModule directives in the html file at the appropriate places `[formGroup]="..."` for form, `formControlName="..."` for controls, `formGroupName=""` for "address" and "modes". On submit of the form, log the value of the form. 
```ts
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-add-workshop',
    standalone: true,
    imports: [],
    templateUrl: './add-workshop.component.html',
    styleUrl: './add-workshop.component.scss',
})
export class AddWorkshopComponent {
    addWorkshopForm!: FormGroup;

    constructor() {
        // EXERCISE: Create a FormGroup variable for the form. Group address, city, state under a separate FormGroup as "location". Group the 2 checkboxes under "modes". On submit of the form. Log the value of the form.
    }
}
```
- In `src/app/workshops/add-workshop/add-workshop.component.html`,
```html
<div>
    <h1 class="my-3">Add a workshop</h1>
</div>

<hr />

<form id="add-workshop-form" novalidate>
    <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
            type="text"
            class="form-control"
            id="name"
            name="name"
            autocomplete="off"
        />
    </div>
    <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select class="form-select" id="category" name="category">
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="language">Language</option>
            <option value="mobile">Mobile</option>
            <option value="devops">Devops</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
            class="form-control"
            id="description"
            rows="3"
            name="description"
        ></textarea>
    </div>
    <div class="mb-3">
        <label for="startDate" class="form-label">Start date</label>
        <input
            type="date"
            class="form-control"
            id="startDate"
            name="startDate"
            autocomplete="off"
        />
    </div>
    <div class="mb-3">
        <label for="endDate" class="form-label">End date</label>
        <input
            type="date"
            class="form-control"
            id="endDate"
            name="endDate"
            autocomplete="off"
        />
    </div>
    <div class="mb-3">
        <label for="time" class="form-label">Time</label>
        <input
            type="text"
            class="form-control"
            id="time"
            name="time"
            autocomplete="off"
        />
    </div>
    <div>
        <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <input
                type="text"
                class="form-control"
                id="address"
                name="address"
                autocomplete="off"
            />
        </div>
        <div class="mb-3">
            <label for="city" class="form-label">City</label>
            <input
                type="text"
                class="form-control"
                id="city"
                name="city"
                autocomplete="off"
            />
        </div>
        <div class="mb-3">
            <label for="state" class="form-label">State</label>
            <input
                type="text"
                class="form-control"
                id="state"
                name="state"
                autocomplete="off"
            />
        </div>
    </div>
    <div class="mb-3">
        <label class="col-lg-2 col-form-label">Modes</label>
        <div class="col-lg-10">
            <div>
                <input type="checkbox" id="inPerson" />
                <label for="inPerson" class="ms-2">In Person</label>
            </div>
            <div>
                <input type="checkbox" id="online" />
                <label for="online" class="ms-2">Online</label>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <label for="imageUrl" class="form-label">Image URL</label>
        <input
            type="url"
            class="form-control"
            id="imageUrl"
            name="imageUrl"
            autocomplete="off"
        />
    </div>
</form>
```

## Step 39: Solution to the above exercise
- In `src/app/workshops/add-workshop/add-workshop.component.ts`,
```ts
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
```
```ts
imports: [ReactiveFormsModule],
```
```ts
constructor(private fb: FormBuilder) {
    this.addWorkshopForm = this.fb.group({
        name: ['', [Validators.required]],
        category: ['', [Validators.required]],
        description: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        time: ['', [Validators.required]],
        location: this.fb.group({
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
        }),
        modes: this.fb.group({
            inPerson: this.fb.control(false),
            online: this.fb.control(false),
        }),
        imageUrl: ['', [Validators.required]],
    });
}

addWorkshop() {
    console.log(this.addWorkshopForm.value);
}
```
- In `src/app/workshops/add-workshop/add-workshop.component.html` (showing validations error messages is left out of this solution).
```html
<div>
    <h1 class="my-3">Add a workshop</h1>
</div>

<hr />

<form
    id="add-workshop-form"
    [formGroup]="addWorkshopForm"
    (ngSubmit)="addWorkshop()"
    novalidate
>
    <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
            type="text"
            class="form-control"
            id="name"
            name="name"
            autocomplete="off"
            formControlName="name"
        />
    </div>
    <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select
            class="form-select"
            id="category"
            name="category"
            formControlName="category"
        >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="language">Language</option>
            <option value="mobile">Mobile</option>
            <option value="devops">Devops</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
            class="form-control"
            id="description"
            rows="3"
            name="description"
            formControlName="description"
        ></textarea>
    </div>
    <div class="mb-3">
        <label for="startDate" class="form-label">Start date</label>
        <input
            type="date"
            class="form-control"
            id="startDate"
            name="startDate"
            autocomplete="off"
            formControlName="startDate"
        />
    </div>
    <div class="mb-3">
        <label for="endDate" class="form-label">End date</label>
        <input
            type="date"
            class="form-control"
            id="endDate"
            name="endDate"
            autocomplete="off"
            formControlName="endDate"
        />
    </div>
    <div class="mb-3">
        <label for="time" class="form-label">Time</label>
        <input
            type="text"
            class="form-control"
            id="time"
            name="time"
            autocomplete="off"
            formControlName="time"
        />
    </div>
    <div formGroupName="location">
        <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <input
                type="text"
                class="form-control"
                id="address"
                name="address"
                autocomplete="off"
                formControlName="address"
            />
        </div>
        <div class="mb-3">
            <label for="city" class="form-label">City</label>
            <input
                type="text"
                class="form-control"
                id="city"
                name="city"
                autocomplete="off"
                formControlName="city"
            />
        </div>
        <div class="mb-3">
            <label for="state" class="form-label">State</label>
            <input
                type="text"
                class="form-control"
                id="state"
                name="state"
                autocomplete="off"
                formControlName="state"
            />
        </div>
    </div>
    <div class="mb-3" formGroupName="modes">
        <label class="col-lg-2 col-form-label">Modes</label>
        <div class="col-lg-10">
            <div>
                <input
                    type="checkbox"
                    id="inPerson"
                    formControlName="inPerson"
                />
                <label for="inPerson" class="ms-2">In Person</label>
            </div>
            <div>
                <input type="checkbox" id="online" formControlName="online" />
                <label for="online" class="ms-2">Online</label>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <label for="imageUrl" class="form-label">Image URL</label>
        <input
            type="url"
            class="form-control"
            id="imageUrl"
            name="imageUrl"
            autocomplete="off"
            formControlName="imageUrl"
        />
    </div>

    <button class="btn btn-primary" [disabled]="addWorkshopForm.invalid">
        Add workshop
    </button>
</form>
```

## Step 40: Adding workshop to the backend
- In `src/app/workshops/workshops.service.ts`,
```ts
postWorkshop(workshop: Omit<IWorkshop, 'id'>) {
    return this.http.post<IWorkshop>(`${this.apiUrl}/workshops`, workshop, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
```
- In `src/app/workshops/add-workshop/add-workshop.component.ts`,
```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { WorkshopsService } from '../workshops.service';
import { ToastService } from '../../common/toast/toast.service';

@Component({
    selector: 'app-add-workshop',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './add-workshop.component.html',
    styleUrl: './add-workshop.component.scss',
})
export class AddWorkshopComponent {
    addWorkshopForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private workshopsService: WorkshopsService,
        private toastService: ToastService,
        private router: Router,
    ) {
        this.addWorkshopForm = this.fb.group({
            name: ['', [Validators.required]],
            category: ['', [Validators.required]],
            description: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            time: ['', [Validators.required]],
            location: this.fb.group({
                address: ['', Validators.required],
                city: ['', Validators.required],
                state: ['', Validators.required],
            }),
            modes: this.fb.group({
                inPerson: this.fb.control(false),
                online: this.fb.control(false),
            }),
            imageUrl: ['', [Validators.required]],
        });
    }

    addWorkshop() {
        this.workshopsService
            .postWorkshop(this.addWorkshopForm.value)
            .subscribe({
                next: (workshop) => {
                    this.toastService.add({
                        message: `Successfully added workshop - ${workshop.name}`,
                        className: 'bg-success text-light',
                        duration: 5000,
                    });

                    this.router.navigateByUrl('/workshops');
                },
                error: (error) => {
                    this.toastService.add({
                        message: `Could not add workshop | ${error.message}`,
                        className: 'bg-danger text-light',
                        duration: 5000,
                    });
                },
            });
    }
}
```
- You should now be able to fill the details in the form, and submit it to add a new workshop to the backend.

## Step 41: Updating (Editing) workshop
- We reuse the `AddWorkshopComponent` for editing as well as there is very little difference between the two.
- Set up additional routing to the `AddWorkshopComponent` component for editing a workshop with given id in `src/app/workshops/workshops.routes.ts`
```ts
{
    path: 'workshops/edit/:id',
    component: AddWorkshopComponent,
    title: 'Edit a workshop',
},
```
- Set link to navigate to edit workshop in `src/app/workshops/workshops-list/item/item.component.html`
```html
<button
    class="me-2 btn btn-info btn-sm btn-action-button"
    title="Edit this workshop"
    [routerLink]="['/workshops', 'edit', workshop.id]"
>
    <fa-icon [icon]="icons.faPencil"></fa-icon>
</button>
```
- Add service method to update a workshop with a given id in `src/app/workshops/workshops.service.ts`
```ts
putWorkshop(workshop: Omit<IWorkshop, 'id'>, id: number) {
    return this.http.put<IWorkshop>(
        `${this.apiUrl}/workshops/${id}`,
        workshop,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}
```
- In `src/app/workshops/add-workshop/add-workshop.component.ts`,
```ts
import { ActivatedRoute, Router } from '@angular/router';
```
```ts
id!: number;
isEditing = false;
```
```ts
constructor(
    private fb: FormBuilder,
    private workshopsService: WorkshopsService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
) {
    const idStr = this.activatedRoute.snapshot.paramMap.get('id');

    if (idStr === null) {
        this.isEditing = false;
    } else {
        this.isEditing = true;
        this.id = +idStr;

        // @todo Fetch the details of the workshop being edited, and populate the form controls
        // Step 1: get the details of workshop with given id
        // Step 2: (inside next) once we get the details, we can use this.addWorkshopForm.patchValue()
        this.workshopsService.getWorkshopById(this.id).subscribe({
            next: (workshop) => {
                // if you use setValue, the value you pass (in this case `workshop`), should not have any extra / missing fields
                // to take care of difference in format of dates in the backend, and the date format of datepicker
                workshop.startDate = workshop.startDate.substring(0, 10);
                workshop.endDate = workshop.endDate.substring(0, 10);

                this.addWorkshopForm.patchValue(workshop);
            },
            error: () => {
                alert(
                    `Something went wrong fetching workshop details. Please reload the page.`
                );
            },
        });
    }

    // rest of existing code...
}
```
```ts
addWorkshop() {
    if (this.isEditing) {
        this.workshopsService
            .putWorkshop(this.addWorkshopForm.value, this.id)
            .subscribe({
                next: (workshop) => {
                    this.toastService.add({
                        message: `Successfully updated workshop with id ${workshop.id}`,
                        className: 'bg-success text-light',
                        duration: 5000,
                    });

                    this.router.navigateByUrl('/workshops');
                },
                error: (error) => {
                    this.toastService.add({
                        message: `Could not edit workshop | ${error.message}`,
                        className: 'bg-danger text-light',
                        duration: 5000,
                    });
                },
            });
    } else {
        this.workshopsService
            .postWorkshop(this.addWorkshopForm.value)
            .subscribe({
                next: (workshop) => {
                    this.toastService.add({
                        message: `Successfully added workshop - ${workshop.name}`,
                        className: 'bg-success text-light',
                        duration: 5000,
                    });

                    this.router.navigateByUrl('/workshops');
                },
                error: (error) => {
                    this.toastService.add({
                        message: `Could not add workshop | ${error.message}`,
                        className: 'bg-danger text-light',
                        duration: 5000,
                    });
                },
            });
    }
}
```
- In `src/app/workshops/add-workshop/add-workshop.component.html`,
```html
<div>
    <h1 class="my-3">{{ isEditing ? "Edit workshop" : "Add a workshop" }}</h1>
</div>
```
```html
<button class="btn btn-primary" [disabled]="addWorkshopForm.invalid">
    {{ isEditing ? "Update workshop" : "Add workshop" }}
</button>
```
- You should now be able to modify the details in the form, and submit it to update a workshop's details in the backend.

## Step 42: Adding Favorites Service
```sh
ng g s workshops/favorites
```
- In `src/app/workshops/favorites.service.ts`
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IWorkshop from './models/IWorkshop';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites: {
    [workshopId: number]: IWorkshop;
  } = {};

  private eventSource = new BehaviorSubject<IWorkshop[]>(
    Object.values(this.favorites)
  );

  public favorites$ = this.eventSource.asObservable();

  public addToFavorites(workshop: IWorkshop) {
    if (this.isFavorite(workshop.id)) {
      return;
    }

    this.favorites[workshop.id] = workshop;
    this.eventSource.next(Object.values(this.favorites));
  }

  public removeFromFavorites(workshopId: number) {
    delete this.favorites[workshopId];
    this.eventSource.next(Object.values(this.favorites));
  }

  public toggleFavorite(workshop: IWorkshop) {
    if (this.isFavorite(workshop?.id)) {
      this.removeFromFavorites(workshop?.id);
    } else {
      this.addToFavorites(workshop);
    }
  }

  public isFavorite(workshopId: number) {
    return !!this.favorites[workshopId];
  }

  constructor() {}
}
```

## Step 43: Setting up the Favorites Component
- In `/src/app/workshops/favorites/favorites.component.ts`
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  constructor(public favoritesService: FavoritesService) {}

  ngOnInit() {}
}
```
- In `/src/app/workshops/favorites/favorites.component.html`
```html
<h1>Favorites</h1>
<hr />

<div *ngIf="favoritesService.favorites$ | async as favorites; else loading">
  <ul>
    <li *ngFor="let favorite of favorites">
      <a [routerLink]="['/workshops', favorite.id]">
        {{ favorite.name }}
      </a>
    </li>
  </ul>
  <div *ngIf="favorites.length === 0">
    You have not marked any workshops as favorites. We hope you'll soon find
    some that pique your interest!
  </div>
</div>

<ng-template #loading> Loading favorites... </ng-template>
```

## Step 44: Adding Favorites from the Workshops List
- Add `FavoritesService` as a dependency in `/src/app/workshops/workshops-list/item/item.component.ts`
```ts
import { faPencil, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

import { FavoritesService } from 'app/workshops/favorites.service';
```
```ts
icons = {
    faPencil,
    faTrash,
    faStar,
    faStarEmpty,
};

constructor(public favoritesService: FavoritesService) {}
```
- In `/src/app/workshops/workshops-list/item/item.component.html`
```html
<div class="card workshop-card w-100 p-3 text-center">
  <span>
    <fa-icon
      [icon]="
        favoritesService.isFavorite(workshop.id)
          ? icons.faStar
          : icons.faStarEmpty
      "
      class="favorite text-success"
      (click)="favoritesService.toggleFavorite(workshop)"
    ></fa-icon>
  </span>
  <div class="card-img-wrapper">
    <img [src]="workshop.imageUrl" [alt]="workshop.name" class="card-img-top" />
  </div>
  <div class="card-body">
    <div>
      <h5 class="card-title">{{ workshop.name }}</h5>
      <div class="workshop-location">
        {{ workshop.location.address }}, {{ workshop.location.city }},
        {{ workshop.location.state }}
      </div>
      <strong class="workshop-duration">
        {{ workshop.startDate | date : "mediumDate" }} -
        {{ workshop.endDate | date : "mediumDate" }},
      </strong>
    </div>
    <div>
      <a [routerLink]="['/workshops/edit', workshop.id]">
        <fa-icon [icon]="icons.faPencil" class="me-2 text-success"></fa-icon>
      </a>
      <fa-icon [icon]="icons.faTrash" class="text-danger" (click)="deleteWorkshop()"></fa-icon>
    </div>
    <!-- <div class="card-text" [innerHTML]="workshop.description"></div> -->
    <a
      class="btn btn-primary btn-sm mt-4"
      [routerLink]="[workshop.id]"
      [attr.aria-label]="'Know more about ' + workshop.name"
      >Know more</a
    >
  </div>
</div>
```

## Step 45: Manage favorites using NgRx
This step outlines how to manage favorite workshops using **NgRx**. This replaces the service-based approach with a state management solution using NgRx v16+. Install NgRx. As of the time of writing this lab guide, support for Angular 20 is not available. Check [https://ngrx.io/guide/store] for the latest version. Use the appropriate version matching the Angular version of your application.
```sh
npm install @ngrx/store@19 @ngrx/effects@19 @ngrx/store-devtools@19
```
- Setup manually (for Standalone Angular 19). In `app/app.config.ts`
```ts
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    // other providers...
    // ...
    provideStore(),       // Root store
    provideEffects(),     // Root effects
    // Feature stores/effects via provideState/provideEffects
  ]
};
```
- Create a file `app/workshops/favorites/favorites.actions.ts` to define the actions

```ts
import { createActionGroup, props } from '@ngrx/store';
import IWorkshop from '../models/IWorkshop';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Add Workshop': props<{ workshop: IWorkshop }>(),
    'Remove Workshop': props<{ workshopId: number }>(),
    'Load Favorites': props<{ favorites: IWorkshop[] }>()
  }
});
```
- Create a file `app/workshops/favorites/favorites.reducer.ts`:

```ts
import { createReducer, on } from '@ngrx/store';
import { FavoritesActions } from './favorites.actions';
import IWorkshop from '../models/IWorkshop';

export const initialState: ReadonlyArray<IWorkshop> = [];

export const favoritesReducer = createReducer(
  initialState,
  on(FavoritesActions.addWorkshop, (state, { workshop }) =>
    state.some(w => w.id === workshop.id) ? state : [...state, workshop]),
  on(FavoritesActions.removeWorkshop, (state, { workshopId }) =>
    state.filter(w => w.id !== workshopId)),
  on(FavoritesActions.loadFavorites, (_, { favorites }) => favorites)
);
```
- Register Feature in Store. Create a file `app/workshops/favorites/favorites.store.ts`

```ts
import { provideState } from '@ngrx/store';
import { favoritesReducer } from './favorites.reducer';

export const provideFavoritesStore = provideState({
  name: 'favorites',
  reducer: favoritesReducer
});
```
- Then add to `app/app.config.ts`:

```ts
import { provideFavoritesStore } from 'app/workshops/favorites/favorites.store';
```
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    // rest of providers...
    // ...

    // add this...
    provideFavoritesStore
  ],
};

```
- Create Selectors. Create a file `app/workshops/favorites/favorites.selectors.ts`.
```ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Workshop } from '../models/workshop.model';

export const selectFavorites = createFeatureSelector<ReadonlyArray<Workshop>>('favorites');

export const isFavorite = (workshopId: number) => 
  createSelector(selectFavorites, favorites => favorites.some(w => w.id === workshopId));
```
- Update Workshops List Component. In `app/workshops/workshops-list/workshops-list.ts`.
```ts
import { inject, computed } from '@angular/core'; // in addition to what is already imported from the module
import { Store } from '@ngrx/store';
import { FavoritesActions } from '../favorites/favorites.actions';
import { selectFavorites, isFavorite } from '../favorites/favorites.selectors';

import { toSignal } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class WorkshopsComponent {
  private store = inject(Store);

  // favorites: IWorkshop[] = [];
  favorites = toSignal(this.store.select(selectFavorites), { initialValue: [] });

  favoriteMap = computed(() => {
    const map = new Map<number, boolean>();
    for (const w of this.favorites()) {
      map.set(w.id, true);
    }
    return map;
  });

  // rest of code...
  // ...

  toggleFavorite(workshop: IWorkshop) {
    const isFav = this.store.selectSignal(isFavorite(workshop.id))();

    if (isFav) {
      this.store.dispatch(FavoritesActions.removeWorkshop({ workshopId: workshop.id }));
    } else {
      this.store.dispatch(FavoritesActions.addWorkshop({ workshop }));
    }
  }

  isFavorite(id: number) {
    return this.favoriteMap().get(id) ?? false;
  }
}
```
- In `app/workshops/workshops-list/workshops-list.html`
```html
<fa-icon
    [icon]="isFavorite(workshop.id) ? icons.faStar : icons.faStarEmpty"
    class="favorite text-success"
    (click)="toggleFavorite(workshop)">
</fa-icon>
```
- Show Favorites in Favorites Component. In `app/workshops/favorites/favorites.component.ts`.
```ts
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFavorites } from '../favorites/favorites.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class FavoritesComponent {
  private store = inject(Store);
  favoriteWorkshops = toSignal(this.store.select(selectFavorites));
}
```
- In `favorites.component.html`
```html
<ul>
  <li *ngFor="let workshop of favoriteWorkshops()">
    {{ workshop.name }}
  </li>
</ul>
```

### Optional Steps - Persisting favorites in local storage using an effect
- Add LocalStorage Persistence Using Effects. In `app/workshops/favorites/favorites.effects.ts`

```ts
import { inject } from '@angular/core';
import { Actions, createEffect, ofType, provideEffects } from '@ngrx/effects';
import { FavoritesActions } from './favorites.actions';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectFavorites } from './favorites.selectors';

export class FavoritesEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  persistFavorites$ = createEffect(
    () => this.actions$.pipe(
      ofType(FavoritesActions.addWorkshop, FavoritesActions.removeWorkshop),
      withLatestFrom(this.store.select(selectFavorites)),
      tap(([_, favorites]) => {
        localStorage.setItem('favorite-workshops', JSON.stringify(favorites));
      })
    ),
    { dispatch: false }
  );
}

export const provideFavoritesEffects = provideEffects(FavoritesEffects);
```
- Register Effect in App. Update `app.config.ts`
```ts
import { provideEffects } from '@ngrx/effects';
import { provideFavoritesEffects } from './store/favorites.effects';
```
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideEffects(),
    provideFavoritesStore,
    provideFavoritesEffects
  ]
};
```
- Load From local storage on application startup. In `app/app.ts`

```ts
import { inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FavoritesActions } from 'app/workshops/favorites/favorites.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  ngOnInit(): void {
    const favorites = JSON.parse(localStorage.getItem('favorite-workshops') || '[]');
    this.store.dispatch(FavoritesActions.loadFavorites({ favorites }));
  }
}
```
- You will now be able to refresh the browser window while preserving the currently added favorites.

---

## Summary Table

| Feature           | Service Approach                  | NgRx Approach                              |
| ----------------- | --------------------------------- | ------------------------------------------ |
| Add to favorites  | `favoritesService.add()`          | `dispatch(addWorkshop({ workshop }))`      |
| Remove favorite   | `favoritesService.remove()`       | `dispatch(removeWorkshop({ workshopId }))` |
| Get all favorites | `favoritesService.getAll()`       | `store.select(selectFavorites)`            |
| Share data        | BehaviorSubject or manual sharing | Global reactive store via NgRx             |
| Persistence       | Manual localStorage sync          | NgRx Effect + Store hydration on load      |

---

## Step 46: Refactor `app-workshop-item` for content projection
We'll convert the static card content into a flexible component that accepts custom header, body, and footer slots.
- Modify `/src/app/workshops/workshops-list/item/item.component.html`. Replace the current `<div class="card">...</div>` with this template featuring three projection slots.

```html
<div class="card workshop-card w-100 p-3 d-flex flex-column">
  <div class="card-header">
    <ng-content select="[item-header]"></ng-content>
  </div>
  <div class="card-body flex-grow-1">
    <ng-content select="[item-body]"></ng-content>
  </div>
  <div class="card-footer">
    <ng-content select="[item-footer]"></ng-content>
  </div>
</div>
```

This design aligns with Angular’s multi-slot projection pattern, inserting each section where appropriate.

- Update parent `/src/app/workshops/workshops-list/workshops-list.component.html`. Wrap the relevant pieces of each workshop within the defined projection slots.

```html
<app-workshop-item [workshop]="workshop" (delete)="confirmAndDeleteWorkshop(workshop)">
  <!-- HEADER -->
  <div item-header class="d-flex justify-content-between align-items-center">
    <h5 class="card-title mb-0">{{ workshop.name }}</h5>
    <span>
      <fa-icon [icon]="favoritesService.isFavorite(workshop.id)? icons.faStar : icons.faStarEmpty"
               class="favorite text-success"
               (click)="favoritesService.toggleFavorite(workshop)">
      </fa-icon>
    </span>
  </div>

  <!-- BODY -->
  <div item-body>
    <img [src]="workshop.imageUrl" [alt]="workshop.name" class="card-img-top mb-2" />
    <div class="workshop-location">
      {{ workshop.location.address }}, {{ workshop.location.city }}, {{ workshop.location.state }}
    </div>
    <strong class="workshop-duration">
      {{ workshop.startDate | date:'mediumDate' }} -
      {{ workshop.endDate | date:'mediumDate' }}
    </strong>
  </div>

  <!-- FOOTER -->
  <div item-footer class="d-flex justify-content-between align-items-center">
    <a [routerLink]="['/workshops/edit', workshop.id]">
      <fa-icon [icon]="icons.faPencil" class="text-success"></fa-icon>
    </a>
    <fa-icon [icon]="icons.faTrash" class="text-danger" (click)="deleteWorkshop(workshop)"></fa-icon>
    <a class="btn btn-primary btn-sm"
       [routerLink]="[workshop.id]"
       [attr.aria-label]="'Know more about ' + workshop.name">
      Know more
    </a>
  </div>
</app-workshop-item>
```
- Make necessary changes in `/src/app/workshops/workshops-list/workshops-list.component.ts`
```ts
import { DatePipe } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
```
```ts
imports: [ItemComponent, NgbAlert, LoadingComponent, PaginationComponent, RouterLink, FontAwesomeModule, DatePipe],
```
```ts
icons = {
    faPencil,
    faTrash,
    faStar,
    faStarEmpty,
};
```
```ts
constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workshopsService: WorskhopsService,
    public favoritesService: FavoritesService, // should be public as the HTML file uses the service directly
    private toastService: ToastService
) {
    // rest of code...
}
```
- __TODO__: CSS changes
This structure clearly separates header, body, and footer, making each section customizable and maintaining the clean layout you already have.

- **Why use content projection?**  
  It enables flexible, reusable components that adapt to different content—similar to Angular’s `ng-content`, which passes external content into defined slots at compile time.
- **Multi-slot projection**    
  Each `ng-content select="[item-*]"` maps to a corresponding `<div item-*>` block in the parent. This empowers them to design rich, customized UI per workshop without altering the component logic.

- Add fallback content - Optionally, include fallback templates in `/src/app/workshops/workshops-list/item/item.component.html`. This ensures the body shows helper text if the parent supplies no content, enabling default projection behavior.
```html
<ng-content select="[item-body]">
  <p class="text-muted">No description available</p>
</ng-content>
```

## Step 47: Project content from the parent using `<ng-template>` and render it in the child using `ngTemplateOutlet`
- In this step we shall see an alternative to passing content to the projected from parent to child, that allows conditional rendering of the passed content, if required at a later point in time in the child as well.
- We define a call to action component that allows the parent to pass a custom template for a **call-to-action section**, and render it in the child component manually. Passing `ng-template` from the parent allows content to be projected conditionally and at a later point in time in the child component.
- Define a child component that supports `@ContentChild`
```bash
ng g c common/call-to-action
```
- In `app/common/call-to-action.component.ts`
```ts
import { Component, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './call-to-action.component.html',
  styleUrl: './call-to-action.component.scss'
})
export class CallToActionComponent {
  @ContentChild('cta') ctaTemplate!: TemplateRef<any>;
}
```
- In `app/common/call-to-action.component.html`
```html
<div class="alert alert-warning text-center">
  <h4>Don't miss out!</h4>
  <ng-container *ngIf="ctaTemplate; else defaultCTA" [ngTemplateOutlet]="ctaTemplate"></ng-container>

  <ng-template #defaultCTA>
    <button class="btn btn-danger">Sign up now</button>
  </ng-template>
</div>
```
- Use it from the parent with a custom `<ng-template>`. In `app/home/home.component.ts`,
```ts
import { CallToActionComponent } from '../common/call-to-action/call-to-action.component';
```
```ts
@Component({
  selector: 'app-home',
  imports: [
    CallToAction
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
```
- In `app/home/home.component.html`, include this at the end.
```html
<section>
  <!-- rest of existing content -->
  <!-- ... -->

  <!-- Add this -->
  <app-call-to-action>
    <ng-template #cta>
      <button class="btn btn-primary">📅 Book Your Workshop Slot</button>
    </ng-template>
  </app-call-to-action>
</section>
```
### What This Demonstrates

* Unlike `<ng-content>`, `<ng-template>` content is:

  * **Not rendered automatically**
  * Passed as a **`TemplateRef`**
  * Rendered manually using `ngTemplateOutlet`

### Output Summary

If the parent passes a `#cta` template:

```
Don't miss out!
📅 Book Your Workshop Slot
```

If no `#cta` is passed:

```
Don't miss out!
Sign up now
```
- The important point is the call to action child component renders the passed template conditionally (using __ngIf__). You can change the condition as per the requirements.

## Step 48: Understanding HTTP Interceptor
- An HTTP interceptor can intercept HTTP requests and responses and process
- A request before it goes out to the backend
- A response before it is consumed by the rest of the Angular app
- Generate interceptor
```sh
ng g interceptor common/auth/jwt
```
- In `app/common/auth/jwt.interceptor.ts`
```ts
import { HttpInterceptorFn } from '@angular/common/http';

localStorage.setItem('auth-token', 'dummy-jwt-token'); // This is added here just for testing purpose. This will be obtained from the backend on successful login.

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth-token');
    const cloned = req.clone({
      setHeaders: { Authorization: token ? `Bearer ${token}` : '' }
    });
    return next(cloned);
};
```
- Registering it in `app.config.ts`
```ts
import {
  HTTP_INTERCEPTORS,
  withInterceptors,
  provideHttpClient
//   withInterceptorsFromDi,
} from '@angular/common/http';

import { jwtInterceptor } from './common/auth/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // rest of code...

    // Registration for HTTP interceptors created using class, say JwtInterceptor. In case modules are used, it can be registered in `app.module.ts` (sample code in note below).
    // provideHttpClient(
    //   // DI-based interceptors must be explicitly enabled.
    //   withInterceptorsFromDi()
    // ),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: JwtInterceptor,
    //   multi: true,
    // }

    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
  ],
};
```
- This adds an `authorization` header to every outgoing HTTP request, demonstrating centralized request handling. Check the request details under Network Tab of the Developer Tools. You will find a request header like so - `authorization: Bearer dummy-jwt-token`
- __NOTE__: In Angular <= 16, interceptors were implemented using classes like below. This is just for your reference. Do not use it as we choose the function alternative to it above.
    - Defining the interceptor using a class
    ```ts
    @Injectable()
    export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('auth-token');
        const cloned = req.clone({
        setHeaders: { Authorization: token ? `Bearer ${token}` : '' }
        });
        return next.handle(cloned);
    }
    }
    ```
    - Registering it in `app.module.ts`

    ```ts
    providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    ```

## Step 49: Adding a Guard
- Guards are used to prevent navigation to or away from a particular route. Let us create a guard that prevents navigation to the workshop details route if the workshop id in the URL is not a nmber.
- Generate a guard (`CanActivate` guard helps restrict navigation to a route) - Select `CanActivate`
```sh
ng g g workshops/validate-workshop
```
- In `app/workshops/validate-workshop-guard.ts`
```ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const validateWorkshopGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router)

  const strId = route.paramMap.get('id') as string;
    const proceed = /^\d+$/.test(strId);

    if (!proceed) {
      _router.navigateByUrl('/');
      return false;
    } else {
      return true;
    }
};
```
- Apply the guard to the route for workshop details. In `app/workshops/workshops.route.ts`
```ts
import { validateWorkshopGuard } from './validate-workshop-guard';
```
```ts
// rest of code...
{
    path: 'workshops/:id',
    component: WorkshopDetailsComponent
    title: 'Details of workshop',
    canActivate: [validateWorkshopGuard /*, any other guards may be added here... */ ],
    children: [
      // rest of code...
    ],
},
// rest of code...
```
- __Note__: In Angular <= 16 guards could only be defined using a class like below. This is just for your reference. Do not use it as we choose the function alternative to it above.
```ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ValidateWorkshopGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const strId = route.paramMap.get('id') as string;
    const proceed = /^\d+$/.test(strId);

    if (!proceed) {
      this._router.navigateByUrl('/');
      return false;
    } else {
      return true;
    }
  }
}
```
- In the route objects, guards written using classes are added in place of functions as shown above.

## Step 50: Lazy loading
- Create `app/workshops/workshop-details.routes.ts`. Move the child route configuration to this file.
```ts
import { Routes } from '@angular/router';

import { SessionsListComponent } from './workshop-details/sessions-list/sessions-list.component';
import { AddSessionComponent } from './workshop-details/add-session/add-session.component';

// Define child routes for ParentComponent
export const parentRoutes: Routes = [
  {
    path: '',
    component: SessionsListComponent,
  },
  {
    path: 'add-session',
    component: AddSessionComponent,
  },
];
```
- In `app/workshops/workshops.routes.ts` first comment out the workshop details route imports (along with child components). This is important, as __components which are lazily loaded must never be statically imported from outside the lazily loaded part!__
```ts
// import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
// import { SessionsListComponent } from './workshop-details/sessions-list/sessions-list.component';
// import { AddSessionComponent } from './workshop-details/add-session/add-session.component';
```
- In the same file, change the workshop details routing configuration to this
```ts
{
    path: 'workshops/:id',
    loadComponent: () =>
      import('./workshop-details/workshop-details.component').then(
        (m) => m.WorkshopDetailsComponent
      ),
    title: 'Details of workshop',
    canActivate: [validateWorkshopGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./workshop-details.routes').then((m) => m.parentRoutes),
      },
    ],
},
```
- Now the workshop details related components are not part of the main bundle. A separate bundle is created which is downloaded in the browser only when you first navigate to the workshop details page. Keep the Network tab open in the browser. Load the app from the home page, and navigate to the workshop details page. You will notice the new bundle being downloaded from the server. The main bundle size would be smaller (with small overhead for lazy loading), thus reducing the first page load time.

## Step 51: Loading components at runtime
- We may sometimes want to load components at run time. For example, the advertisements to be shown in an application may be determined by data available at runtime - for example, there may be different types of ad components, and the the type of the ads to be shown may be known only at runtime (may be the backend gives the data).
- First we create 3 types of advertisement components. For simplcity, we have use `temmplate` to define the HTML template for the component inline (rather than a separate HTML file). Note that `AdBannerComponent` and `AdVideoComponent` also take input parameters.
```sh
ng g c common/ads/ad-banner
ng g c common/ads/ad-text
ng g c common/ads/ad-video
```
- In `app/common/ads/ad-banner/ad-banner.component.ts`
```ts
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ad-banner',
  template: `
    <div style="border: 2px solid #007bff; padding: 10px; background: #e7f1ff; text-align: center;">
      <img
        [src]="imageSrc"
        alt="Banner Ad"
        style="max-width: 100%; height: auto;"
      />
      <p style="margin-top: 8px; font-weight: bold;">Sponsored by {{ company }}</p>
    </div>
  `
})
export class AdBannerComponent {
  @Input() imageSrc!: string;
  @Input() company!: string;
}
```
- In `app/common/ads/ad-text/ad-text.component.ts`
```ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ad-text',
  template: `
    <div style="border: 2px dashed #28a745; padding: 15px; background: #f4fff4;">
      <h4 style="margin: 0 0 8px 0; color: #155724;">🔥 Limited Time Offer!</h4>
      <p style="margin: 0 0 8px 0;">
        Get <strong>50% OFF</strong> your first purchase at <em>GreenCart</em> — your go-to store for eco-friendly essentials.
      </p>
      <p style="margin: 0 0 8px 0;">
        Use code <code>GREEN50</code> at checkout.
      </p>
      <button
        style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;"
        (click)="onClick()"
      >
        Shop Now
      </button>
    </div>
  `
})
export class AdTextComponent {
  onClick() {
    window.open('https://example.com', '_blank');
  }
}
```
- In `app/common/ads/ad-video/ad-video.component.ts`
```ts
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ad-video',
  template: `
    <div style="border: 2px solid #dc3545; padding: 10px; background: #fff3f3;">
      <video width="100%" height="240" controls autoplay muted loop style="display: block; margin: 0 auto;">
        <source [src]="videoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p style="text-align: center; font-weight: bold; margin-top: 8px;">
        {{ captionText }}
      </p>
    </div>
  `
})
export class AdVideoComponent {
  @Input() videoSrc!: string;
  @Input() captionText!: string;
}
```
- We shall add advertisements dynamically on the home page. First add a container for advertisement components - we set a template reference variabe `adHost` so that we can get hold of a view container reference for this element. In `app/home/home.component.html`
```html
<!-- Add this at the end -->
<ng-container #adHost></ng-container>
```
- In `app/home/home.component.ts` add the necessary imports
```ts
import {
  Component,
  inject,
  ViewContainerRef,
  ViewChild,
  viewChild,
  AfterViewInit,
  Type,
  OnDestroy
} from '@angular/core';
```
- We shall implement 2 lifecycle methods `ngAfterViewInit` (called after child view DOM is ready) and `ngOnDestroy` (when component is about to be removed from the DOM, eg. on navigating to a different page).
```ts
export class Home implements AfterViewInit, OnDestroy {
  // rest of code...
}
```
- Add data members to set up cycling through advertisements. Also get a view container reference to the `ng-container` where ad conmponents will be dynamically rendered. The `@ViewChild()` query helps us get this reference. In Angular 17+ there is a signal-based approach as well to do this - using `viewChild()`. Both are demonstrated below.
```ts
export class Home implements AfterViewInit, OnDestroy {
  // Every component has its own associated view container - To get a reference to the host view container ref we can do so...
  // private viewContainerRef = inject(ViewContainerRef);

  // We instead create a separate view container ref (Angular 16-)
  // @ViewChild('adHost', { read: ViewContainerRef, static: true })
  // viewContainerRef!: ViewContainerRef;

  // We instead create a separate view container ref (Angular 17+)
  private viewContainerRef = viewChild('adHost', { read: ViewContainerRef });

  private adTypes = ['banner', 'video', 'text'];
  private currentIndex = 0;
  private intervalId: any;

  private adConfigs = [
    {
      type: 'banner',
      imageSrc: 'https://via.placeholder.com/468x60?text=Ad+1',
      company: 'AdCorp'
    },
    {
      type: 'video',
      videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
      captionText: 'Check out our new features!'
    },
    {
      type: 'banner',
      imageSrc: 'https://via.placeholder.com/468x60?text=Ad+2',
      company: 'CoolSoft'
    }
  ];

  // rest of code...
}
```
- We use `ngAfterViewInit` lifecycle method to start loading the ad once the view is ready, and set up the ad cycling logic. Cleanup is ensured using `ngOnDestroy` lifecycle method.
```ts
export class Home implements AfterViewInit, OnDestroy {
  // rest of code...

  ngAfterViewInit(): void {
    this.loadNextAd(); // Load first ad
    this.intervalId = setInterval(() => this.loadNextAd(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  // rest of code...
}
```
- We finally add the logic to loading components dynamically based on the type of the ad. The `ViewContainerRef` `createComponent` method is used to load components dynamically (returns a `ComponentRef`). It also has a `clear` method to remove any component already loaded (used to clear the previously loaded ad). `setInput` of a `ComponentRef` is used to pass input parameters to the dynamically loaded component. Note that the signal-based approach on Angular 17+ required optional chaining (`?.`) when accessing properties and methods on `ViewContainerRef` / `ComponentRef` as the reference may be `undefined`.
```ts
export class Home implements AfterViewInit, OnDestroy {
  // rest of code...

  private async loadNextAd() {
    const type = this.adTypes[this.currentIndex];
    const component = await this.resolveComponent(type);

    // For Angular 16-
    // this.viewContainerRef.clear();
    // const componentRef = this.viewContainerRef.createComponent(component);

    // For Angular 17+
    this.viewContainerRef()?.clear();
    const componentRef = this.viewContainerRef()?.createComponent(component);

    // get ad config
    const ad = this.adConfigs[this.currentIndex];

    // Set @Input()s
    if (type === 'banner') {
      componentRef?.setInput('imageSrc', ad.imageSrc);
      componentRef?.setInput('company', ad.company);
    } else if (ad.type === 'video') {
      componentRef?.setInput('videoSrc', ad.videoSrc);
      componentRef?.setInput('captionText', ad.captionText);
    }

    this.currentIndex = (this.currentIndex + 1) % this.adTypes.length;
  }

  private async resolveComponent(type: string): Promise<Type<any>> {
    switch (type) {
      case 'banner':
        const banner = await import('../common/ads/ad-banner/ad-banner');
        return banner.AdBannerComponent;

      case 'video':
        const video = await import('../common/ads/ad-video/ad-video');
        return video.AdVideoComponent;

      case 'text':
        const text = await import('../common/ads/ad-text/ad-text');
        return text.AdTextComponent;

      default:
        throw new Error(`Unknown ad type: ${type}`);
    }
  }
}
```

## Step 52: Understanding signals and using them
- A signal is a reactive state primitive introduced in Angular v16.
- To create a signal
```ts
const counter = signal(0);
```
- To set a signal to a new value
```ts
counter.set(5)
```
- Or, to update it based on the current value
```ts
counter.update(v => v + 1)
```
- Signals are used for
  - Declaring reactive local state in Angular components
  - Tracking derived values using `computed()` - for example,
  ```ts
  count = signal(2);
  double = computed(() => this.count() * 2);
  ```
  - Replacing the need for RxJS in simple state flows
  - __Signals make change detection more efficient__ - Signals enable automatic change detection in templates and `computed()`. Once Zoneless change detection become production-ready (maybe Angular 21+), signals would likely be the standard way to work with component data.
  - Additionally, you can encapsulate signal-based logic in reusable functions or services - such functions are termed as __custom hooks__
- We shall create a custom hook `useFilterableData`, that will help understand how signals are used, and how custom hooks are created to share reusable logic.
- Define the custom hook in `app/signal/filter.signal.ts`. Here `array` and `filterKey` are signals, and `filteredArray` can be determined based on the former 2 variables - hence we define it as a __computed value__. We return these values to the component that needs to define use these.
```ts
import { computed, signal } from '@angular/core';

// type FilterFunction = <ItemType>(item: ItemType) => boolean;

export const useFilterableData = <
  // FilterKeyProperty extends string,
  ItemType extends { name: string }
>() =>
  // filterFunction: FilterFunction
  {
    const array = signal([] as Array<ItemType>);
    const filterKey = signal('');
    const filteredArray = computed(() => {
      const key = filterKey().toUpperCase();

      return array().filter((item) => {
        return item.name.toUpperCase().includes(key);
      });
    });

    const hasFilteredOutItems = array().length !== filteredArray().length;

    return {
      array,
      filterKey,
      filteredArray,
      hasFilteredOutItems,
    };
  };

```
- In our case, we would like to use this to filter the workshops list based on user input. We make to following changes in order to use the custom hooks defined above. In `app/workshops/workshops-list/workshops-list.component.ts`
```ts
import { useFilterableData } from '../../signals/filter.signal';
```
```ts
// We don't need these data member now since we use the signals from the custom hook (`useFilterableData`)
// workshops!: IWorkshop[]; // all the 10 workshops for the page
// filteredWorkshops!: IWorkshop[]; // only filtered workshops
// filterKey = '';

filterable: ReturnType<typeof useFilterableData<IWorkshop>> = useFilterableData<IWorkshop>();;
```
- In the `next` method of the observer passed to get workshops
```ts
next: (fetchedWorkshops) => {
  this.filterable.array.set(fetchedWorkshops);
  this.loading = false;
}
```
- Change the filtering logic
```ts
// filterWorkshops() {
//   this.filteredWorkshops = this.workshops.filter(
//     (w) => w.name.toLowerCase().includes(this.filterKey.toLowerCase())
//   );
// }

filterWorkshops(event: Event) {
  this.filterable.filterKey.set((event?.target as HTMLInputElement).value);
}
```
- In the `deleteWorkshop` method, update the logic that sets the `workshops`
```ts
// update this.workshops
// this.workshops = this.workshops.filter(
//     (w) => w.id !== workshop.id
// );
// this.filterWorkshops();

this.filterable.array.set(this.filterable.array().filter(
    (w) => w.id !== workshop.id
));
```
- In `app/workshops/workshops-list/workshops-list.component.html` you can remove the `ngModel` binding in the filter input, and pass on the event data, i.e. `$event`
```html
<input
    type="search"
    class="form-control"
    placeholder="Type to search by name"
    (input)="filterWorkshops($event)"
/>

@if ( filterable.filterKey() !== '' ) {
    <div>
        Workshops whose name has
        <span class="text-primary">{{ filterable.filterKey() }}</span> are shown.
    </div>
}
```
- Update the `@for` loop like so.
```html
@for ( workshopItem of filterable.filteredArray(); track workshopItem.id ) {
  <!-- rest of code... -->
}
```

## Step 53: OnPush change detection strategy for optimizing rendering performance
We can benefit from `ChangeDetectionStrategy.OnPush` for improving rendering performance in the sessions list `app-item` component, which receives `session` as an `@Input()`. By default, Angular uses the **Default** change detection strategy, which checks **everything** on every change detection cycle. With `OnPush`, Angular only checks a component when:

* An `@Input()` reference **changes**
* An **event** is triggered in the component
* An **Observable emits** (if used via `async`)
* You **manually mark it for check**

- In the session list item component
```ts
@Input() session!: ISession;
```
* This `session` is passed from session lost component using a `@for` loop over `sessions[]`.
* If the `session` object changes by reference (as it does after an upvote), Angular can efficiently re-render only that `app-item`.

This gives **performance benefits**, especially when rendering many `app-item`s. Let's enable `OnPush` strategy.

- Add `OnPush` to `app/workshops/workshop-details/sessions-list/item/item.component.ts`

```ts
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VotingWidget],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item {
  @Input() session!: ISession;
  @Output('updateVote') updateVote = new EventEmitter<number>();

  // to know if the template is re-evaluated during change detection for a component instance
  logRender() {
    console.log( 'rendering session list item :', this.session );
  }

  // Best for verifying input change-based re-renders - This is just to check which session is re-rendered on change - ngOnChanges() is called only when an @Input() changes (here, session) — which is exactly what OnPush checks for.
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log(`Item component re-rendered for session: ${this.session.name}`);
  //   console.log('Changes:', changes);
  // }

  // ngDoCheck() runs on every CD cycle (even for OnPush components), but only if Angular believes there might be changes. For OnPush, it only triggers when @Input() references change or local events occur
  // ngDoCheck(): void {
  //   console.log( '*** Executing **ngDoCheck ***' );
  //   console.log(`Checked: ${this.session.name}`);
  // }

  updateSessionVote($event: number) {
    this.updateVote.emit($event);
  }
}
```
- Call `logRender()` in the template to determine when change detection runs for a component instance. In `app/workshops/workshop-details/sessions-list/item/item.component.html`
```html
<div class="row">
    <!-- rest of the UI -->
    <!-- ... -->

    {{ logRender() }}
</div>
```
- Ensure you **replace** the session object on update in the `SessionsList` component. Instead of mutating the object directly in `app/workshops/workshop-details/sessions-list/sessions-list.component.ts`, do so __immutably__ (__Note__ - this is __crucial__!)
```ts
// session.upvoteCount = updatedSession.upvoteCount;
this.sessions = this.sessions.map(s =>
  s.id === updatedSession.id ? updatedSession : s
);
```
- This creates a **new array** and **new session object**, which makes Angular's OnPush strategy detect that the `@Input()` reference changed.
- Check the console for the log from `logRender`. Try with both existing code and with the changes we made for enabling `OnPush`-based change detection. You will find that the template for only the session list item instance of the session you voted for has been re-evaluated.

### Benefits Recap

| With Default Strategy               | With OnPush                        |
| ----------------------------------- | ---------------------------------- |
| Every component rechecked on change | Only checked if `@Input()` changes |
| Unnecessary renders                 | Only updated `session` re-renders  |
| Slower for large lists              | Faster, more optimized             |

## Step 54: HTTP retry and error handling using RxJS operators
To add **retry and reusable error handling logic** across methods and services in Angular, you can do the following.

- Create a reusable `HttpErrorHandler` service. In `app/common/http-error-handler.service.ts`
```bash
ng g s common/http-error-handler
```

```ts
// src/app/common/http-error-handler.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend/server error
      console.error(`Server returned code ${error.status}, body was:`, error.error);
    }

    return throwError(() => new Error(this.getFriendlyMessage(error)));
  }

  private getFriendlyMessage(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Unable to connect to the server.';
    if (error.status >= 400 && error.status < 500)
      return 'A request error occurred. Please check your input.';
    if (error.status >= 500)
      return 'A server error occurred. Please try again later.';
    return 'An unknown error occurred.';
  }
}
```
- Update the `WorkshopsService` with `retry` and `catchError`. In `app/workshops/workshops.service.ts`
```ts
import { Injectable } from '@angular/core';
import IWorkshop from './models/IWorkshop';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { catchError, retry } from 'rxjs/operators';
import { HttpErrorHandlerService } from '../common/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService
  ) {}

  getWorkshops(page: number = 1) {
    return this.http.get<IWorkshop[]>(
      `${this.apiUrl}/workshops`,
      { params: { _page: page } }
    ).pipe(
      retry(2),
      catchError(this.errorHandler.handleError)
    );
  }

  getWorkshopById(workshopId: number) {
    return this.http.get<IWorkshop>(
      `${this.apiUrl}/workshops/${workshopId}`
    ).pipe(
      retry(2),
      catchError(this.errorHandler.handleError)
    );
  }

  deleteWorkshopById(workshopId: number) {
    return this.http.delete<void>(
      `${this.apiUrl}/workshops/${workshopId}`
    ).pipe(
      retry(1),
      catchError(this.errorHandler.handleError)
    );
  }

  postWorkshop(workshop: Omit<IWorkshop, 'id'>) {
    return this.http.post<IWorkshop>(
      `${this.apiUrl}/workshops`,
      workshop,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      catchError(this.errorHandler.handleError)
    );
  }
}
```
- __EXERCISE__: Update the session service in `app/workshops/sessions.service.ts` similarly.

## Step 55: Debouncing and using async scheduler
— Angular **Forms API** provides a `valueChanges` __observable__ on form controls like `FormControl`. This is a clean and reactive way to apply **debouncing**. Let us refactor the WorkshopsList component with `FormControl` and `valueChanges`
- In `app/workshops/workshops-list/workshops-list.component.html`, update to use `formControl`
```html
<input
  type="search"
  class="form-control"
  placeholder="Type to search by name"
  [formControl]="searchControl"
/>
```
- In `app/workshops/workshops-list/workshops-list.component.ts`
```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import IWorkshop from '../models/IWorkshop';

import { Subject, asyncScheduler } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil, observeOn, map } from 'rxjs/operators';
```
```ts
imports: [
  ReactiveFormsModule
  // rest of imports...
  // ...
]
```
```ts
export class WorkshopsList implements OnInit, OnDestroy {
  workshops: IWorkshop[] = [];
  filteredWorkshops: IWorkshop[] = [];

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        observeOn(asyncScheduler), // Push filtering to macrotask queue
        map(term => this.filterWorkshops()),
        takeUntil(this.destroy$)
      )
      .subscribe(filteredWorkshops => this.filteredWorkshops = filteredWorkshops);

      // rest of code...
      // ...
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```
- __NOTE__: This pattern in Angular is **crucial for preventing memory leaks** when using **RxJS `takeUntil()`** for subscription cleanup.
```ts
ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```
- When you subscribe to observables (like `valueChanges`), those subscriptions stay **active** unless you unsubscribe. If you navigate away or destroy the component, the observable keeps emitting — which:
  * Causes **memory leaks**
  * Might try to update a destroyed component, leading to runtime errors

### What this code does

| Code                       | Purpose                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- |
| `this.destroy$`            | A `Subject<void>` that acts as a **notifier** to terminate observables       |
| `takeUntil(this.destroy$)` | Tells each observable to **unsubscribe automatically** when `destroy$` emits |
| `this.destroy$.next()`     | Emits a value to **trigger unsubscription**                                  |
| `this.destroy$.complete()` | Closes the notifier itself to **free resources**                             |

- Note the use of `asyncScheduler` with `observeOn()` to keep the UI responsive when filtering a large dataset (like a list of workshops). If we have `WorkshopsListComponent` display hundreds or thousands of workshops (say), filtering should **not freeze the UI** when the user types a search term.
- Without it, filtering happens immediately inside the main thread. With it
    * The filtering gets **scheduled** in the **next macrotask** (via `setTimeout()`).
    * Angular gets a chance to **render** the UI (e.g., spinner, keystrokes).
    * Prevents **jank/freeze** for large computations (e.g., thousands of items).

### Try This:
* Add a spinner (`<div *ngIf="loading">Loading...</div>`) before filtering starts.
* Without `observeOn(asyncScheduler)`, the spinner may not render.
* With it, the spinner renders first, then filtering happens.