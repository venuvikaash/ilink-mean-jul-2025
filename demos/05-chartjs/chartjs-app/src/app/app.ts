import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseChartDirective } from "ng2-charts";
import PieExample1 from "./examples/01-pie";
import BarExample2 from "./examples/02-bar";
import LineExample3 from './examples/03-line';
import DoughnutExample4 from './examples/04-doughnut';
import BubbleExample5 from './examples/05-bubble';
import PolarAreaExample6 from './examples/06-polar-area';
import AnimationsExample7 from './examples/07-animations';

@Component({
  selector: 'app-root',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chartjs-app');

  public example1 = PieExample1;
  public example2 = BarExample2;
  public example3 = LineExample3;
  public example4 = DoughnutExample4;
  public example5 = BubbleExample5;
  public example6 = PolarAreaExample6;
  public example7 = AnimationsExample7;
}
