# MEAN Stack Training
- June 30 - July 18, 2025 for iLink Digital

## Exercises
- Angular
    - Step 20: Implementing filtering of workshops list (by category) in the backend
    - Step 25: Complete loading, error handling, and optionally, refactor and create a sessions list item component
    - Step 27: Using environment files for enabling environment-based settings
    - Step 28: Set up a toast message service and container to display toast messages
    - Step 30: Deleting a workshop (Last part to show a dialog box)
    - Step 34: Use the toast service to display toast after trying to add a session
    - Step 35: Complete it by enabling submission of the new session data to the backend
    - Step 36: Using Form Builder
    - Step 37: Setting up custom and cross-field validations
    - Step 41: Updating (Editing) workshop
    - All remaining steps in Angular which were demonstrated
- RxJS
    - Try all the RxJS code snippets which were demoed only
- Node JS and Express JS
    - Try all Day 10 Node code
    - Explore transform streams
    - How 'error' event (if emitted by event emitter) has special status and MUST be handled.
- Express JS
    - Step 14 onwards (remaining API endpoints)

## Questions
- Best industry practices to not expose secrets from frontend
- Does Angular provide any help for version upgrades? - Answered
- What if we have read many chunks, streamed as response, but error occurs in a later chunk? What is a good way to handle it?

## Hosted backends
- Workshops server - https://workshops-server.onrender.com/
- Mantra online store server - https://mantra-server-nzl2.onrender.com/api

## Topics if time permits
- Signals (We will do) - DONE
- Angular Universal
- Taking care of browser inconsistencies
- MFE in Angular
- Data tables
- HTTPS (we will do) - DONE
- Publishing npm packages

## Daywise Summary

### Day 1: Getting Started with Angular
- Created the Angular app, and understood the project structure, its dependencies, scripts, build and serve process, and launching the app
- Basic concepts like components, data binding, event binding, conditional rendering using *ngIf
- Installing Angular Bootstrap and using its components
- Creating components like Home, Menu
- Setting up routing and configuring the router

### Day 2: Component and Service Basics
- RouterLink, RouterLinkActive, RouterLinkActiveOptions
- Handling Page Not Found
- Services and DI
- Fetching data using HttpClient, subscribing to Observable
- Handling UI states and showing a list - @if, @else if, @else, @for, *ngFor
- Creating utility components and passing input data, attribute binding

### Day 3: Pipes, @Output, EventEmitter, Router, ActivatedRoute, handling query string parameters, 2-way data-binding
- Creating list item component
- Using built-in pipes, creating custom pipes with extra arguments
- Implementing pagination
- Communicating from child to parent component (@Output, EventEmitter, custom event handling)
- Setting query string parameters and subscribing to query string parameter changes (Router, ActivatedRoute, navigate, queryParamMap)
- 2-way data binding

### Day 4: Dynamic routes, child routes, environment files, shared service
- Discussed progress on exercise from Day 3 (Step 20)
- Added workshop details page - dynamic path parameters, and ActivatedRoute.paramsMap observable. Also Next workshop feature to demonstrate the events coming from the observable. Also covered innerHTML attribute and XSS vulnerability.
- Using icons from FontAwesome
- Child routing configuration (SessionsList, AddSession components)
- VotingWidget component that reinforces @Input(), @Output. PUT request handling.
- Using environment files for development / production configuration
- Toast messages through a shared service

### Day 5: Form handling
- Deleting a workshop - DELETE HTTP request
- Template-driven forms - FormsModule, validation, template reference variables, NgModel instance properties (value, errors, valid, dirty, touched), NgForm, ngSubmit event
- Reactive forms - ReactiveFormsModule, validation, FormGroup, FormControl, formGroup, formControlName, Validators, Cross-field / custom validators, FormBuilder
- Handling POST HTTP request to add a session to the backend

### Day 6: Miscellaneous topics in Angular
- Form to add a workshop
- Favorites service to share list of favorites in the app
- NgRx overview (Store, slice, actions, reducer, selector) and a store to share list of favorites in the app
- Content projection
- HTTP interceptor
- Adding navigation guards

### Day 7: Miscellaneous topics in Angular and Introduction to RxJS
- Advanced Content Projection - ng-template, ngTemplateOutlet, ngContainer, @ContentChild
- Lazy loading, dynamic import, loadComponent, loadChildren
- Dynamic components - ViewContainerRef, createComponent, setInput, @ViewChild, ngAfterViewInit, ngOnDestroy
- OnPush change detection - passing changes in immutable way
- Introduction to RxJS - Observable, Observer, Subscription, Observable creation operators - interval, of and fromEvent, making HTTP requests using RxJS ajax

### Day 8: RxJS
- Sequential Execution with `concat()`
- Parallel Emissions with `merge()`
- Operators - `take()`, `filter()`, `map()`
- Error handling with `catchError()`
- Higher-order mapping operators - `concatMap()`, `mergeMap()`
- Operator composition using `pipe()`
- Handling serial and parallel ajax calls with `switchMap()` and `forkJoin()`

### Day 9: Node JS
- Basic HTTP server
- package.json and package-lock.json
- Adding third-party modules - dependencies and development dependencies - nodemon, lodash
- Semantic versioning
- Custom modules - modules.exports, exports, require, order of execution, module caching
- Asynchronous programming - setTimeout, event queue and event loop, callbacks, callback hell, promises

### Day 10: Advanced Node JS
- async..await
- readFile vs readFileSync, promise-based file handling, writeFile
- Streamed file reading and writing, pipe() for connecting read and write streams
- Event emitter for communication - on(), emit()
- HTTP module - url, querystring, method, headers, status code
- exec() for executing commands using the shell, and reading the results

## Day 11: Introduction to Express JS
- Why use Express JS rather than vanilla Node JS?
- Setting up the web server in Express
- Routing using the Application object, Modularizing routing using the Router object
- Sending responses, redirects, HTML response, JSON response, status code, handling GET, POST request
- Setting up middleware, body parsing middleware for parsing request JSON body, request logging using morgan, error-handling middleware, handling HTTP errors
- Joi for schema-based validations

## Day 12: Buildings APIs in Express
- Refactoring to create controller, service layers
- Defining schemas and creating, registering models in Mongoose
- Model methods for updating the database, and querying, including pagination, sorting, filtering, projecting, updating single and multi-valued (array) fields
- Handling query and path parameters
- Handling relationships between collections and joins, adding virtual fields in schema

## Day 13: Authentication, Authorization, CORS, Web Sockets
- Session voting APIs
- Setting up local user collection, and user registration, hashing password
- Login, verifying hashed password and JWT generation
- Protecting endpoints, route-level middleware and token verification (authorization)
- Authorization (based on user roles)
- Setting up CORS for frontend to make requests to the backend
- Using web sockets for voting on sessions - integration with Angular app

## Day 14: Chart.js and Signals in Angular
- Installing Chart.js, ng2-charts, configuring in Angular apps
- Chart type, data, datasets, options
- COnfiguring tooltips, title, axes, legends, ticks, grid lines
- Different types of charts - line, bar, pie, doughnut, polar, bubble
- Getting started with animations, handling user interactions Dynamic chart updates
- Plugins, performance optimizations guidelines
- Signals in Angular