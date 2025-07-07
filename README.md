# MEAN Stack Training
- June 30 - July 18, 2025 for iLink Digital

## Exercises
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


## Hosted backends
- Workshops server - https://workshops-server.onrender.com/
- Mantra online store server - https://mantra-server-nzl2.onrender.com/api

## Topics if time permits
- Signals
- Angular Universal
- Taking care of browser inconsistencies
- MFE in Angular
- Data tables

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