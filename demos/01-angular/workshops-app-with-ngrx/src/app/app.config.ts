import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { JwtInterceptor } from 'app/common/auth/jwt.interceptor';

import { routes } from './app.routes';
import { routes as workshopsRoutes } from './workshops/workshops.routes';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideFavoritesStore } from 'app/workshops/favorites/favorites.store';
import { provideFavoritesEffects } from 'app/workshops/favorites/favorites.effects';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideRouter(workshopsRoutes),
    provideRouter(routes),
    provideHttpClient(
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
    provideStore(),       // Root store
    provideEffects(),     // Root effects
    provideFavoritesStore,
    provideFavoritesEffects
  ],
};
