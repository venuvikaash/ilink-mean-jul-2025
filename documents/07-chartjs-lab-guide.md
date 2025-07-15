# Chart JS in an Angular app - Lab Guide
[Chart.js](https://www.chartjs.org/docs/latest/) is a very popular open-source JavaScript charting library. Another open source package [`ng2-charts`](https://valor-software.com/ng2-charts/), provides Angular directives for integrating Chart.js into the Angular application.

__REVIEW__: As of the time of writing this lab guide, `ng2-charts` supports __Angular 17__.

## Step 1: Create an Angular application

- __REVIEW__: We choose Angular version 17 to create the application. If we have a later version of the Angular CLI we will need to uninstall it, and reinstall Angular CLI v17
```bash
npm uninstall -g @angular/cli
npm install -g @angular/cli@17
```
- Check the version of the Angular CLI. It should be v17.
```bash
ng version
```

- Create the Angular app
```bash
ng new chartjs-app
```

- __REVIEW__: Choices to be made during app creation
    - ? Which stylesheet format would you like to use? __CSS__
    - ? Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? __No__

- Choices to be made during app creation
    ✔ Do you want to create a 'zoneless' application without zone.js (Developer Preview)? __No__  
    ✔ Which stylesheet format would you like to use? __CSS__  
    ✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? __No__  


- Install `chart.js` and `ng2-charts`
```bash
npm i chart.js ng2-charts
```
- Configure Chart JS in the app. In `src/app/app.config.ts`
```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
  ]
};
```
- __Note__: If using modules (and not standalone components), then the configuration is on these lines in `app/app.module.ts`
```ts
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent],
  providers: [ provideCharts(withDefaultRegisterables()) ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
- Include `BaseChartDirective` in the App component class, i.e. in `app/app.ts`. Also add data for it.
```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BaseChartDirective ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chartjs-app');

  public chartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'],
    datasets: [
      {
        data: [300, 500, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
    ]
  };

  public chartType: ChartType = 'pie';
}
```
- __Note__: In Angular 16-, `ng2-charts` used to export `NgChartsModule` that needed to be imported into the component (if standalone component is used - else into its module) instead of `BaseChartDirective`. For more details check: https://github.com/valor-software/ng2-charts/issues/2000?utm_source=chatgpt.com
- In the component HTML file `app/app.html`
```html
<canvas
  baseChart
  [data]="chartData"
  [type]="chartType"
></canvas>

<router-outlet></router-outlet>
```