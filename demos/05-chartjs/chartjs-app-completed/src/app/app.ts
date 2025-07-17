import { Component, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import PieExample1 from './examples/01-pie';
import BarExample2 from './examples/02-bar';
import LineExample3 from './examples/03-line';
import DoughnutExample4 from './examples/04-doughnut';
import BubbleExample5 from './examples/05-bubble';
import PolarExample6 from './examples/06-polar-area';
import AnimationsExample7 from './examples/07-animations';
import DynamicExample8 from './examples/08-dynamic';
import EventsExample9 from "./examples/09-events";
import PluginExample10 from "./examples/10-plugin-datalabels";
import OptimizedExample11 from "./examples/11-optimized";

@Component({
  selector: 'app-root',
  imports: [BaseChartDirective ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chartjs-app');

  example1 = PieExample1;
  example2 = BarExample2;
  example3 = LineExample3;
  example4 = DoughnutExample4;
  example5 = BubbleExample5;
  example6 = PolarExample6;
  example7 = AnimationsExample7;
  example8 = DynamicExample8;
  example9 = EventsExample9;
  example10 = PluginExample10;
  example11 = OptimizedExample11;

  refreshData() {
    this.example8.updateData();
  }
}