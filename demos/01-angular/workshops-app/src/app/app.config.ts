import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS,
  withInterceptors, } from '@angular/common/http';

import { routes } from './app.routes';
import { routes as workshopsRoutes } from './workshops/workshops.routes';
import { jwtInterceptor } from './common/auth/jwt-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(workshopsRoutes),
    provideRouter(routes), // the page not found route will be matched at the very end
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
  ]
};
