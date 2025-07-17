# Chart JS in an Angular app - Lab Guide

[Chart.js](https://www.chartjs.org/docs/latest/) is a very popular open-source JavaScript charting library. Another open source package [`ng2-charts`](https://valor-software.com/ng2-charts/), provides Angular directives for integrating Chart.js into the Angular application.

## Step 1: Create an Angular application and configure Chart.js

-   Create the Angular app

```bash
ng new chartjs-app
```

-   Choices to be made during app creation
    ✔ Do you want to create a 'zoneless' application without zone.js (Developer Preview)? **No**  
     ✔ Which stylesheet format would you like to use? **CSS**  
     ✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? **No**

-   Install `chart.js` and `ng2-charts` (And `bootstrap` for basic styling)

```bash
npm i chart.js ng2-charts npm i bootstrap
```

-   Configure Chart JS in the app. In `src/app/app.config.ts`

```ts
import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

import { provideCharts, withDefaultRegisterables } from "ng2-charts";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideCharts(withDefaultRegisterables()),
    ],
};
```

-   **Note**: If using modules (and not standalone components), then the configuration is on these lines in `app/app.module.ts`

```ts
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";

@NgModule({
    declarations: [AppComponent],
    providers: [provideCharts(withDefaultRegisterables())],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
- Add Bootstrap CSS to the project for styling in src/styles.css
```css
/* You can add global styles to this file, and also import other style files */
@import url("bootstrap/dist/css/bootstrap.css");
```

## Step 2: Creating a Basic Chart (using &lt;canvas&gt;)

-   Include `BaseChartDirective` in the App component class, i.e. in `src/app/app.ts`. Also add data for it.
    **Note**: We removed the `<router-outlet></router-oulet>` and the corresponding `RouterOutlet` import.

```ts
import { Component, signal } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import PieExample1 from "./examples/01-pie";

@Component({
    selector: "app-root",
    imports: [BaseChartDirective],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App {
    protected readonly title = signal("chartjs-app");

    example1 = PieExample1;
}
```

-   In `src/app/examples/types.ts`

```ts
export type PieChartType = "pie";
```

-   In `src/app/examples/01-pie.ts`

```ts
import type { ChartData } from "chart.js";
import { PieChartType } from "./types";

const chartType: PieChartType = "pie";

const chartData: ChartData<PieChartType, number[], string | string[]> = {
    labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    datasets: [
        {
            data: [300, 500, 100],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
    ],
};

export default {
    chartType,
    chartData,
};
```

-   **Note**: In Angular 16-, `ng2-charts` used to export `NgChartsModule` that needed to be imported into the component (if standalone component is used - else into its module) instead of `BaseChartDirective`. For more details check: https://github.com/valor-software/ng2-charts/issues/2000?utm_source=chatgpt.com
-   In the component HTML file `src/app/app.html`

```html
<div class="container">
    <div class="row">
        <div class="col col-md-4">
            <canvas
                baseChart
                [data]="example1.chartData"
                [type]="example1.chartType"
            ></canvas>
        </div>
    </div>
</div>
```

## Step 3: Understanding and Using the Chart Configuration Object, data Object, and options Object (Including making the chart responsive)

Chart.js charts are driven by a configuration object that includes three key parts:

-   **`type`**: The type of chart (e.g., `'pie'`, `'bar'`, `'line'`, etc.)
-   **`data`**: The dataset(s) and labels to be displayed
-   **`options`**: Additional configuration for chart behavior, appearance, tooltips, legends, axes, etc.

In `ng2-charts`, these are passed using `[type]`, `[data]`, and `[options]` bindings.

### Example: Add chart options to customize display

-   In `src/app/examples/01-pie.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
```

```ts
const chartOptions: ChartOptions<PieChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top",
            labels: {
                color: "black",
                font: {
                    size: 14,
                },
            },
        },
        title: {
            display: true,
            text: "Sales Distribution",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

### Explanation

-   The `chartType` is `'pie'`
-   The `chartData` contains both labels and a dataset with `data` and `backgroundColor`
-   The `chartOptions` object adds a title and positions the legend at the top

The `data` object defines the actual content to be rendered. It consists of two main properties:

-   **`labels`**: An array of strings used as labels on the x-axis (or legend in pie/doughnut charts).
-   **`datasets`**: An array of objects where each object represents one dataset (with values and visual styles).

### General structure:

```ts
{
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [
    {
      label: 'Series Name',
      data: [value1, value2, value3],
      backgroundColor: ['color1', 'color2', 'color3'],
      // ... other dataset-specific options
    }
  ]
}
```

The two Chart.js options — `responsive` and `maintainAspectRatio` — both affect **how the chart behaves when the container resizes**, but they serve different purposes:

### `responsive: true`

-   **What it does**: Makes the chart **automatically resize** to fit the container element.
-   **Effect**:

    -   The chart listens to window resize events.
    -   It updates its width and height based on the parent container's dimensions.

-   **Default value**: `true`

**Example**: If the parent `<div>` is 600px wide, the canvas chart will resize to fit that width.

### `maintainAspectRatio: false`

-   **What it does**: Allows the chart to **ignore the default aspect ratio** and stretch to fill the container.
-   **Effect**:

    -   If `true`: Chart will maintain the default 2:1 width\:height ratio (or the one set in `aspectRatio`)
    -   If `false`: Chart fills **entire height and width** of the container

**Default value**: `true` (which often restricts vertical growth)

### Combined Behavior

| Option                                            | Chart Resizes? | Fills Container Height?       |
| ------------------------------------------------- | -------------- | ----------------------------- |
| `responsive: true` + `maintainAspectRatio: true`  | ✅ Yes         | ❌ No (height is restricted)  |
| `responsive: true` + `maintainAspectRatio: false` | ✅ Yes         | ✅ Yes (fills width & height) |

### Recommended for Angular apps

Use both options **together** when embedding a chart in a container with flexible layout:

```ts
responsive: true,
maintainAspectRatio: false
```

This gives **full responsive flexibility** and makes your charts grow/shrink with the container in both directions.

You can use different configuration properties depending on the chart type. These options are based on the full [Chart.js configuration documentation](https://www.chartjs.org/docs/latest/configuration/).

## Step 4: Using Multiple Datasets (Bar Chart Example)

In many chart types like **bar**, **line**, or **radar**, you can visualize and compare multiple series of data using the `datasets` array. Each object in the `datasets` array represents a separate line or bar group.

-   Add a chart type in `src/app/examples/types.ts`

```ts
export type BarChartType = "bar";
```

-   In `src/app/examples/bar.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { BarChartType } from "./types";

const chartType: BarChartType = "bar";

const chartData: ChartData<BarChartType> = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
        {
            label: "2023",
            data: [65, 59, 80, 81],
            backgroundColor: "#42A5F5",
        },
        {
            label: "2024",
            data: [75, 69, 90, 95],
            backgroundColor: "#66BB6A",
        },
    ],
};

const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Quarterly Sales Comparison",
            font: {
                size: 18,
            },
        },
        legend: {
            position: "top",
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Quarter",
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Sales (in thousands)",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

-   In `src/app/app.ts` add the new example to the `examples` array

```ts
import BarExample2 from "./examples/02-bar";
```

```ts
example2 = BarExample2;
```

-   In `src/app/app.html`, wrap the canvas in a responsive container

```html
<div class="container">
    <div class="row">
        <div class="col col-md-4">
            <canvas
                baseChart
                [data]="example1.chartData"
                [type]="example1.chartType"
                [options]="example1.chartOptions"
            ></canvas>
        </div>
        <div class="col col-md-4">
            <canvas
                baseChart
                [data]="example2.chartData"
                [type]="example2.chartType"
                [options]="example2.chartOptions"
            ></canvas>
        </div>
    </div>
</div>
```

### Explanation

-   Each `dataset` has its own `label`, `data`, and color.
-   Bars for each quarter (`Q1`, `Q2`, etc.) will be grouped together and color-coded per dataset.
-   The `scales` option configures axis labels and enforces the y-axis to start from zero.

## Step 5: Configuring Tooltips, Titles, and Legends

Chart.js provides configuration options under the `plugins` property of the `chartOptions` object to customize elements like the chart **title**, **tooltip**, and **legend**. These settings are defined inside the `options.plugins` object and can be applied to any chart type.

-   Update `chartOptions` to further configure tooltips, titles, and legends in `src/app/examples/02-bar.ts`

```ts
const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Quarterly Sales Comparison",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                color: "#333",
                font: {
                    size: 12,
                    weight: "normal",
                },
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: "#f5f5f5",
            titleColor: "#000",
            bodyColor: "#000",
            borderColor: "#ccc",
            borderWidth: 1,
            callbacks: {
                label: (tooltipItem) => {
                    return `Value: ${tooltipItem.raw}`;
                },
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Quarter",
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Sales (in thousands)",
            },
        },
    },
};
```

### Explanation

| Plugin    | Purpose                                                    |
| --------- | ---------------------------------------------------------- |
| `title`   | Sets the main chart title                                  |
| `legend`  | Controls the position, style, and visibility of the legend |
| `tooltip` | Controls the appearance and content of tooltips            |

-   The `tooltip.callbacks.label` function allows you to customize the format of the value shown.
-   You can change the tooltip background, font color, and borders.

## Step 6: Customizing Scales (Axes), Ticks, and Grid Lines

Chart.js allows fine-grained control over **scales**, including axes configuration, tick styling, and grid line appearance. These settings are defined under the `scales` property of the `chartOptions` object.

-   Let's customize the bar chart we created in the previous step to show how to style these scale elements. Update `chartOptions` in `src/app/examples/02-bar.ts`

```ts
const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Quarterly Sales Comparison",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            position: "bottom",
        },
        tooltip: {
            enabled: true,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Quarter",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            ticks: {
                color: "#666",
                font: {
                    size: 12,
                },
            },
            grid: {
                display: true,
                color: "#e0e0e0", // grid + axis line
                lineWidth: 1,
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Sales (in thousands)",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            ticks: {
                color: "#666",
                font: {
                    size: 12,
                },
                stepSize: 10,
            },
            grid: {
                display: true,
                color: "#e0e0e0",
                lineWidth: 1,
            },
        },
    },
};
```

### Explanation

| Option           | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `scales.x.title` | Sets the axis label text, color, and font for the x-axis                |
| `scales.x.ticks` | Configures color, font size, and tick display options for x-axis labels |
| `scales.x.grid`  | Controls grid line display, color, thickness, and border for the x-axis |
| `scales.y.title` | Same as above, but for the y-axis                                       |
| `scales.y.ticks` | Customize tick values like color, font, step size                       |
| `scales.y.grid`  | Controls grid line styling for the y-axis                               |

You can apply similar configuration to other chart types (e.g., line, radar) with the appropriate axis names.

## Step 7: Line Chart Example

Line charts are useful for showing data trends over time. You can use one or more datasets to compare changes across series.

-   Add a new chart type in `src/app/examples/types.ts`

```ts
export type LineChartType = "line";
```

-   Add a new file `src/app/examples/03-line.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { LineChartType } from "./types";

const chartType: LineChartType = "line";

const chartData: ChartData<LineChartType> = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Website A",
            data: [30, 45, 60, 50, 70, 90],
            fill: false,
            borderColor: "#42A5F5",
            tension: 0.3,
            pointBackgroundColor: "#42A5F5",
        },
        {
            label: "Website B",
            data: [40, 55, 50, 65, 85, 100],
            fill: false,
            borderColor: "#66BB6A",
            tension: 0.3,
            pointBackgroundColor: "#66BB6A",
        },
    ],
};

const chartOptions: ChartOptions<LineChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Monthly Traffic Comparison",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            position: "top",
        },
        tooltip: {
            enabled: true,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Month",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            ticks: {
                color: "#666",
                font: {
                    size: 12,
                },
            },
            grid: {
                color: "#e0e0e0",
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Visitors (in thousands)",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            ticks: {
                color: "#666",
                font: {
                    size: 12,
                },
            },
            grid: {
                color: "#e0e0e0",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

-   Update `src/app/app.ts` to import and bind the line chart

```ts
import LineExample3 from "./examples/03-line";
```

```ts
example3 = LineExample3;
```

-   Update `src/app/app.html` to add the new chart

```html
<div class="container">
    <div class="row">
        <!-- Pie Chart -->
        <div class="col col-md-4">
            <canvas
                baseChart
                [data]="example1.chartData"
                [type]="example1.chartType"
                [options]="example1.chartOptions"
            ></canvas>
        </div>

        <!-- Bar Chart -->
        <div class="col col-md-4">
            <canvas
                baseChart
                [data]="example2.chartData"
                [type]="example2.chartType"
                [options]="example2.chartOptions"
            ></canvas>
        </div>

        <!-- Line Chart -->
        <div class="col col-md-4">
            <canvas
                baseChart
                [data]="example3.chartData"
                [type]="example3.chartType"
                [options]="example3.chartOptions"
            ></canvas>
        </div>
    </div>
</div>
```

### Explanation

-   The `datasets` in a line chart include styling for the line (`borderColor`), and optional point styling.
-   The `tension` property adds a smooth curve to the lines.
-   We've applied full configuration including tooltips, titles, and axes styling.

## Step 8: Doughnut Chart Example

A doughnut chart is very similar to a pie chart but with a hole in the center. It's great for showing proportional data in a more compact format.

-   Add a new chart type in `src/app/examples/types.ts`

```ts
export type DoughnutChartType = "doughnut";
```

-   Add a new file `src/app/examples/04-doughnut.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { DoughnutChartType } from "./types";

const chartType: DoughnutChartType = "doughnut";

const chartData: ChartData<DoughnutChartType, number[], string> = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
        {
            label: "Votes",
            data: [300, 50, 100],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverOffset: 8,
        },
    ],
};

const chartOptions: ChartOptions<DoughnutChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Favorite Colors",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            position: "bottom",
            labels: {
                color: "#333",
                font: {
                    size: 12,
                },
            },
        },
        tooltip: {
            enabled: true,
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

-   Update `src/app/app.ts` to import and bind the doughnut chart

```ts
import DoughnutExample4 from "./examples/04-doughnut";
```

```ts
example4 = DoughnutExample4;
```

-   Update `src/app/app.html` to add the new chart

```html
<div class="row">
    <!-- ... -->

    <!-- Doughnut Chart -->
    <div class="col col-md-4">
        <canvas
            baseChart
            [data]="example4.chartData"
            [type]="example4.chartType"
            [options]="example4.chartOptions"
        ></canvas>
    </div>
</div>
```

### Explanation

-   The `type` is `'doughnut'`.
-   The `hoverOffset` adds spacing when hovering over a segment.
-   Labels and values are mapped 1:1 to colors.
-   Like pie charts, doughnut charts work with a single dataset and no axes.

## Step 9: Bubble Chart Example

Bubble charts are used to display three dimensions of data. Each data point is defined by its **x** and **y** position, and a **radius (r)** that determines the size of the bubble.

-   Add a new chart type in `src/app/examples/types.ts`

```ts
export type BubbleChartType = "bubble";
```

-   Add a new file `src/app/examples/05-bubble.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { BubbleChartType } from "./types";

const chartType: BubbleChartType = "bubble";

const chartData: ChartData<BubbleChartType> = {
    datasets: [
        {
            label: "Dataset 1",
            data: [
                { x: 10, y: 20, r: 10 },
                { x: 15, y: 10, r: 15 },
                { x: 25, y: 30, r: 20 },
                { x: 35, y: 15, r: 12 },
                { x: 45, y: 25, r: 8 },
            ],
            backgroundColor: "#42A5F5",
        },
        {
            label: "Dataset 2",
            data: [
                { x: 12, y: 28, r: 10 },
                { x: 18, y: 12, r: 18 },
                { x: 30, y: 35, r: 15 },
                { x: 40, y: 20, r: 10 },
                { x: 50, y: 30, r: 6 },
            ],
            backgroundColor: "#66BB6A",
        },
    ],
};

const chartOptions: ChartOptions<BubbleChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Bubble Chart Example",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            position: "top",
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const data = context.raw as {
                        x: number;
                        y: number;
                        r: number;
                    };
                    return `x: ${data.x}, y: ${data.y}, r: ${data.r}`;
                },
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "X Axis",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            grid: {
                color: "#e0e0e0",
            },
        },
        y: {
            title: {
                display: true,
                text: "Y Axis",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            grid: {
                color: "#e0e0e0",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

-   Update `src/app/app.ts` to import and bind the bubble chart

```ts
import BubbleExample5 from "./examples/05-bubble";
```

```ts
example5 = BubbleExample5;
```

-   Update `src/app/app.html` to add the new chart

```html
<div class="row">
    <!-- ... -->

    <!-- Bubble Chart -->
    <div class="col col-md-4">
        <canvas
            baseChart
            [data]="example5.chartData"
            [type]="example5.chartType"
            [options]="example5.chartOptions"
        ></canvas>
    </div>
</div>
```

### Explanation

-   The `type` is `'bubble'`.
-   Each `data` point is an object with `x`, `y`, and `r` values.
-   The `r` value determines the size of the bubble.
-   You can compare two or more datasets on the same grid.

## Step 10: Polar Area Chart Example

A **polar area chart** is similar to a pie chart, but each segment has the same angle and differs in radius based on value. It's useful for comparing values across categories where order doesn't matter.

-   Add a new chart type in `src/app/examples/types.ts`

```ts
export type PolarAreaChartType = "polarArea";
```

-   Add a new file `src/app/examples/06-polar-area.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { PolarAreaChartType } from "./types";

const chartType: PolarAreaChartType = "polarArea";

const chartData: ChartData<PolarAreaChartType, number[], string> = {
    labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
    datasets: [
        {
            label: "Scores",
            data: [11, 16, 7, 3, 14],
            backgroundColor: [
                "#FF6384",
                "#4BC0C0",
                "#FFCE56",
                "#E7E9ED",
                "#36A2EB",
            ],
        },
    ],
};

const chartOptions: ChartOptions<PolarAreaChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Polar Area Chart Example",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            position: "right",
            labels: {
                color: "#333",
                font: {
                    size: 12,
                },
            },
        },
        tooltip: {
            enabled: true,
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

-   Update `src/app/app.ts` to import and bind the polar area chart

```ts
import PolarExample6 from "./examples/06-polar-area";
```

```ts
example6 = PolarExample6;
```

-   Update `src/app/app.html` to add the new chart

```html
<div class="row">
    <!-- ... -->

    <!-- Polar Area Chart -->
    <div class="col col-md-4">
        <canvas
            baseChart
            [data]="example6.chartData"
            [type]="example6.chartType"
            [options]="example6.chartOptions"
        ></canvas>
    </div>
</div>
```

### Explanation

-   `type` is `'polarArea'`.
-   Each label gets a segment of equal angle.
-   Segment size (radius) is determined by the data value.
-   This chart supports only one dataset and works well for category-wise comparison.

## Step 11: Implementing Chart Animations

Chart.js supports powerful animation options that allow you to animate transitions for scales, dataset elements, and entire charts. You can configure these using the `animation` and `animations` properties in the `options` object.

-   Add a new file `src/app/examples/07-animations.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { BarChartType } from "./types";

const chartType: BarChartType = "bar";

const chartData: ChartData<BarChartType> = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
        {
            label: "Users Online",
            data: [12, 19, 3, 5, 8],
            backgroundColor: "#42A5F5",
        },
    ],
};

const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    plugins: {
        title: {
            display: true,
            text: "Daily Online Users",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            display: false,
        },
    },
    animation: {
        duration: 1000, // Total duration of animation in ms
        easing: "easeOutQuart", // Easing function for animation
    },
    animations: {
        x: {
            type: "number",
            easing: "easeOutBounce",
            duration: 1200,
            from: -50,
        },
        y: {
            type: "number",
            easing: "easeInOutElastic",
            duration: 1200,
            from: 100,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Users",
            },
        },
        x: {
            title: {
                display: true,
                text: "Day of Week",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

-   Update `src/app/app.ts` to import and bind the animations example

```ts
import AnimationsExample7 from "./examples/07-animations";
```

```ts
example7 = AnimationsExample7;
```

-   Update `src/app/app.html` to add the new animated chart

```html
<div class="row">
    <!-- ... -->

    <!-- Chart Animations -->
    <div class="col col-md-4">
        <canvas
            baseChart
            [data]="example7.chartData"
            [type]="example7.chartType"
            [options]="example7.chartOptions"
        ></canvas>
    </div>
</div>
```

### Explanation

| Property       | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `animation`    | Top-level animation config (duration, easing)                           |
| `animations.x` | Custom animation for the x-axis (e.g., from left)                       |
| `animations.y` | Custom animation for the y-axis (e.g., from bottom with elastic easing) |

You can animate individual properties like `x`, `y`, `radius`, `color`, etc., depending on the chart type. Use this to create engaging visualizations.

## Step 12: Dynamic Chart Updates

In real-world apps, chart data often changes dynamically — e.g., when receiving new data from a backend API, a WebSocket stream, or user interaction. Chart.js (via `ng2-charts`) allows you to update the data or labels of a chart programmatically.

-   Add a new file `src/app/examples/08-dynamic.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { signal } from "@angular/core";
import { BarChartType } from "./types";

const chartType: BarChartType = "bar";

// Reactive chart data using Angular signals
const chartData = signal<ChartData<BarChartType>>({
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
        {
            label: "Sales",
            data: [12, 19, 3, 5, 2],
            backgroundColor: "#42A5F5",
        },
    ],
});

const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Live Sales Data",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

function updateData() {
    // Simulate new data for demonstration
    const newValues = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 50)
    );
    chartData.update((data) => ({
        ...data,
        datasets: [
            {
                ...data.datasets[0],
                data: newValues,
            },
        ],
    }));
}

export default {
    chartType,
    chartData,
    chartOptions,
    updateData,
};
```

-   Update `src/app/app.ts` to import and expose the dynamic chart

```ts
import DynamicExample8 from "./examples/08-dynamic";
```

```ts
example8 = DynamicExample8;

refreshData() {
  this.example8.updateData();
}
```

-   Update `src/app/app.html` to show and update the dynamic chart

```html
<div class="row">
    <!-- ... -->

    <!-- Dynamic Chart Updates -->
    <div class="col col-md-4 align-items-center justify-content-center">
        <div class="row">
            <div class="col-12">
                <canvas
                    baseChart
                    [data]="example8.chartData()"
                    [type]="example8.chartType"
                    [options]="example8.chartOptions"
                ></canvas>
            </div>
            <div class="col-12 d-flex align-items-center justify-content-center">
                <button class="btn btn-primary m-2" (click)="refreshData()">
                    Update Chart Data
                </button>
            </div>
        </div>
    </div>
</div>
```

### Explanation

-   Angular **signals** enable reactive updates for the `chartData`.
-   The `updateData()` function modifies the dataset’s values randomly.
-   Clicking the button triggers the update and the chart rerenders accordingly.

## Step 13: Handling Events and User Interactions (onClick, onHover)

Chart.js (and by extension, `ng2-charts`) provides ways to handle user interactions on charts — such as clicking on chart elements or hovering over them. This can be useful for custom tooltips, interactivity, or drill-down functionality. Let's implement a chart that responds to user events.

- Create a new file `src/app/examples/09-events.ts`

```ts
import type {
  ChartData,
  ChartOptions,
  ActiveElement,
  ChartEvent
} from 'chart.js';
import { signal } from '@angular/core';
import { BarChartType } from './types';

const chartType: BarChartType = 'bar';

const initialData = [12, 19, 3, 5];
const labels = ['A', 'B', 'C', 'D'];

const defaultColor = '#42A5F5';
const highlightColor = '#FF7043';

const chartData = signal<ChartData<BarChartType>>({
  labels,
  datasets: [
    {
      label: 'Votes',
      data: [...initialData],
      backgroundColor: initialData.map(() => defaultColor)
    }
  ]
});

const chartOptions: ChartOptions<BarChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Interactive Chart',
      font: {
        size: 18,
        weight: 'bold'
      }
    }
  }
};

const lastClicked = signal<string>('None');

function onClickHandler(event: ChartEvent | null, activeElements: unknown[]): void {
  if (!event || !activeElements?.length) return;

  const elements = activeElements as ActiveElement[];
  const index = elements[0].index;
  const label = chartData().labels?.[index];
  lastClicked.set(String(label));

  // Update colors so only clicked bar is highlighted
  const updatedColors = initialData.map((_, i) =>
    i === index ? highlightColor : defaultColor
  );

  chartData.update(data => ({
    ...data,
    datasets: [
      {
        ...data.datasets[0],
        backgroundColor: updatedColors
      }
    ]
  }));
}

export default {
  chartType,
  chartData,
  chartOptions,
  onClickHandler,
  lastClicked
};
```

-  Update `src/app/app.ts` to import and expose the event example

```ts
import EventsExample9 from "./examples/09-events";
```

```ts
example9 = EventsExample9;
```

- Update `src/app/app.html` to bind the chart and show clicked label

```html
<div class="row">
    <!-- ... -->

    <!-- Interactive Chart -->
    <div class="col col-md-4" style="height: 320px;">
        <canvas
            baseChart
            [data]="example9.chartData()"
            [type]="example9.chartType"
            [options]="example9.chartOptions"
            (chartClick)="example9.onClickHandler($event.event ?? null, $event.active ?? [])"
        ></canvas>
        <p class="text-muted">Clicked Label: {{ example9.lastClicked() }}</p>
    </div>
</div>
```

### Explanation

| Concept           | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `(chartClick)`    | Angular output emitted when a canvas element is clicked     |
| `ActiveElement[]` | Array of chart elements under the mouse cursor              |
| `ChartEvent`      | The raw DOM event passed from Chart.js                      |
| `signal()`        | Used to reactively store and display the last clicked label |

### How the color change works

* The original dataset is stored in `initialData`.
* `backgroundColor` is dynamically updated with a new array when a bar is clicked.
* Only the clicked index gets the **highlight color**; others revert to default.

## Step 14: Using Community Plugins to Extend Functionality

Chart.js has a vibrant ecosystem of community plugins that enhance functionality — from data labels and zoom/pan capabilities to advanced legends and tooltips. These plugins integrate seamlessly with `ng2-charts`.

Let's see the use of the popular [`chartjs-plugin-datalabels`](https://chartjs-plugin-datalabels.netlify.app/) which displays values directly on the chart.
- Install the plugin

```bash
npm install chartjs-plugin-datalabels
```

- Register the plugin. Update `app.config.ts` to register the plugin using `withDefaultRegisterables`

```ts
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import ChartDataLabels from "chartjs-plugin-datalabels";

export const appConfig: ApplicationConfig = {
    providers: [
        // ...
        provideCharts(withDefaultRegisterables( [ChartDataLabels] )),
    ],
};
```

- Create a new file: `src/app/examples/10-plugin-datalabels.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { BarChartType } from "./types";

const chartType: BarChartType = "bar";

const chartData: ChartData<BarChartType> = {
    labels: ["Product A", "Product B", "Product C"],
    datasets: [
        {
            label: "Units Sold",
            data: [65, 59, 80],
            backgroundColor: "#42A5F5",
        },
    ],
};

const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Product Sales with Data Labels",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            display: false,
        },
        datalabels: {
            color: "#000",
            anchor: "end",
            align: "top",
            font: {
                weight: "bold",
            },
            formatter: (value) => `${value} units`,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Units",
            },
        },
        x: {
            title: {
                display: true,
                text: "Products",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

- Bind the chart in Angular. Update `src/app/app.ts`:

```ts
import PluginExample10 from "./examples/10-plugin-datalabels";
```

```ts
example10 = PluginExample10;
```

Update `src/app/app.html`:

```html
<div class="row">
    <!-- ... -->

    <!-- Chart with Data Labels -->
    <div class="col col-md-4">
        <canvas
            baseChart
            [data]="example10.chartData"
            [type]="example10.chartType"
            [options]="example10.chartOptions"
        ></canvas>
    </div>
</div>
```
- Since the plugin is registered globally it affects all charts. We now need to disable data labels for individual charts by addng this option in each example created earlier. Let us do for `src/app/examples/01-pie.ts` - add this under `options.plugins`
```ts
datalabels: {
    display: false
}
```

### Explanation

| Feature                                        | Purpose                                        |
| ---------------------------------------------- | ---------------------------------------------- |
| `chartjs-plugin-datalabels`                    | Displays values directly on bars or points     |
| `withDefaultRegisterables({ plugins: [...] })` | Registers external plugins with `ng2-charts`   |
| `plugins.datalabels`                           | Chart options section to configure data labels |

You can explore other plugins like:

* [`chartjs-plugin-zoom`](https://www.chartjs.org/chartjs-plugin-zoom/latest/)
* [`chartjs-plugin-annotation`](https://www.chartjs.org/chartjs-plugin-annotation/latest/)

## Step 15: Performance Optimization with Large Datasets

When working with large datasets (hundreds or thousands of points), rendering and interactivity can become sluggish. Chart.js and `ng2-charts` offer strategies to **optimize performance** in such cases.

### Techniques for Optimization

| Technique                       | Benefit                                      |
| ------------------------------- | -------------------------------------------- |
| Reduce animation complexity     | Speeds up rendering                          |
| Disable tooltips/hover effects  | Reduces CPU usage on mouse events            |
| Skip rendering invisible points | Useful for panning/zooming or long timelines |
| Use lighter chart types         | Line charts are faster than radar/bubble     |

### Example: Optimized Line Chart for 1000+ Points

- Create `src/app/examples/11-optimized.ts`

```ts
import type { ChartData, ChartOptions } from "chart.js";
import { LineChartType } from "./types";

// Generate large dataset (1000 points)
const dataPoints = Array.from({ length: 1000 }, (_, i) => i);
const values = dataPoints.map((x) => Math.sin(x * 0.01) * 50 + 50);

const chartType: LineChartType = "line";

const chartData: ChartData<LineChartType> = {
    labels: dataPoints.map(String),
    datasets: [
        {
            label: "Sensor Data",
            data: values,
            borderColor: "#42A5F5",
            pointRadius: 0, // Hide points for performance
            borderWidth: 1,
        },
    ],
};

const chartOptions: ChartOptions<LineChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        line: {
            tension: 0, // No curve for performance
        },
    },
    animation: false, // Disable animation
    plugins: {
        title: {
            display: true,
            text: "Large Dataset (1000+ Points)",
            font: {
                size: 16,
                weight: "bold",
            },
        },
        tooltip: {
            enabled: false,
        },
        legend: {
            display: false,
        },
        datalabels: {
            display: false
        }
    },
    scales: {
        x: {
            display: true, // Optional: hide axis (Set to false
        },
        y: {
            beginAtZero: true,
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};
```

- Update `app.ts`

```ts
import OptimizedExample11 from "./examples/11-optimized";
```
```ts
example11 = OptimizedExample11;
```

- Update `app.html`

```html
<div class="row">
    <!-- ... -->

    <!-- Optimized Chart -->
    <div class="col col-md-12">
        <canvas
            baseChart
            [data]="example11.chartData"
            [type]="example11.chartType"
            [options]="example11.chartOptions"
        ></canvas>
    </div>
</div>
```

### Summary of Optimizations Applied

* **`pointRadius: 0`**: Skips rendering point circles
* **`animation: false`**: Disables entry animation
* **No tooltips or interactivity**: Reduces event listeners
* **Flat line (`tension: 0`)**: Speeds up drawing

To enhance the performance and usability of large datasets in your last example, you can add **pan and zoom support** using the official plugin [`chartjs-plugin-zoom`](https://www.chartjs.org/chartjs-plugin-zoom/latest/).

---

## Step 16: Performance Optimization - Add Pan and Zoom to Optimized Chart
Adding pan and zoom using `chartjs-plugin-zoom` can help __improve perceived performance and responsiveness__ when rendering large datasets by reducing the number of elements the user sees and interacts with at any given time.

### How it helps (even without reducing actual dataset size)

| Mechanism                   | Performance Impact                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------- |
| **Viewport Limiting**       | By zooming in, Chart.js only needs to render fewer visible points                  |
| **Reduced DOM Painting**    | Less canvas drawing = faster frame rendering, especially with large point counts   |
| **No need for pagination**  | Users can explore data dynamically without complex pagination logic                |
| **Tooltips, hover reduced** | You can selectively **disable hover/tooltip** on unzoomed views for faster redraws |

Rendering **1000 points** at once is heavy. But zooming into a slice (say 100–150 points):
- Reduces rendering load
- Reduces memory usage per redraw
- Speeds up mouse interaction and redraws
So while the full dataset is still loaded into memory, **the interactive rendering and event-handling cost drops** significantly.

- Install the plugin

```bash
npm install chartjs-plugin-zoom
```

- Register the plugin. In `app.config.ts`, import and register it using `withDefaultRegisterables`

```ts
import zoomPlugin from 'chartjs-plugin-zoom';
```
```
provideCharts(withDefaultRegisterables( [ChartDataLabels, zoomPlugin] )),
```

- Update `11-optimized.ts`. Modify the `chartOptions` to include `zoom` and `pan`:

```ts
const chartOptions: ChartOptions<LineChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  elements: {
    line: {
      tension: 0
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Large Dataset (Pan & Zoom)',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    tooltip: {
      enabled: false
    },
    legend: {
      display: false
    },
    datalabels: {
        display: false
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
        modifierKey: 'ctrl' // Optional: Only pan when holding Ctrl
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      }
    }
  },
  scales: {
    x: {
      display: true
    },
    y: {
      beginAtZero: true
    }
  }
};
```

### Interacting with the chart

| Action              | Effect                |
| ------------------- | --------------------- |
| Scroll mouse wheel  | Zoom in/out (X axis)  |
| Pinch (touch)       | Zoom on touch devices |
| Ctrl + drag (mouse) | Pan horizontally      |

> Tip: To reset zoom, you can call `chart.resetZoom()` via a reference to the `BaseChartDirective`.

### Optional: Add reset button

- In `app.ts`, inject `ViewChild`:

```ts
@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

resetZoom() {
  this.chart?.chart?.resetZoom();
}
```

- In `app.html`:

```html
<button class="btn btn-outline-secondary btn-sm" (click)="resetZoom()">Reset Zoom</button>
```

__Further exploration__: You can further improve performance by using the __decimation plugin__ (built-in to Chart.js) to reduce visible data points. Expore it!

## Step 17: Mixed Chart

In **Chart.js**, you can **mix chart types** by using the `type: 'bar'` (or another base chart type) on the overall chart, and specifying different types per dataset using the `type` property on each dataset. This is commonly referred to as a **mixed chart** or **combo chart**.

### ✅ Compatible Chart Types for Mixing

You can mix any combination of **the following Cartesian chart types**:

| Chart Type    | Can be Mixed?                        |
| ------------- | ------------------------------------ |
| `bar`         | ✅ Yes                                |
| `line`        | ✅ Yes                                |
| `bubble`      | ✅ Yes                                |
| `scatter`     | ✅ Yes                                |
| `area`        | ✅ (via line with `fill`)             |
| `candlestick` | ❌ (requires chartjs-chart-financial) |
| `radar`       | ❌ No                                 |
| `doughnut`    | ❌ No                                 |
| `pie`         | ❌ No                                 |
| `polarArea`   | ❌ No                                 |

> **Mixable** if they share the same axes (e.g. `bar` and `line`) on Cartesian (X/Y) plane.

### Example: Mixed Bar and Line Chart
- In `src/app/app.ts`
```ts
public mixedExample = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        type: 'bar',
        label: 'Sales',
        data: [50, 60, 70],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        type: 'line',
        label: 'Trend',
        data: [55, 58, 65],
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  },
};
```
-   Update `src/app/app.html` to add the new chart

```html
<div class="row">
    <!-- ... -->

    <!-- Mixed Chart -->
    <div class="col col-md-4">
        <canvas
            baseChart
            [data]="mixedExample.data"
            [type]="mixedExample.type"
            [options]="mixedExample.options"
        ></canvas>
    </div>
</div>
```

### Notes

* All mixed types must be **Cartesian charts** (x/y axes).
* **Radar**, **pie**, **polarArea**, and **doughnut** charts are **not compatible** for mixing with others.
* Axes settings might need to be adjusted to accommodate mixed types (e.g., dual axes).