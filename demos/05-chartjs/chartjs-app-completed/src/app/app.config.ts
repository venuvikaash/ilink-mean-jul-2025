import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from 'chartjs-plugin-zoom';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables( [ChartDataLabels, zoomPlugin] )),
  ]
};
