import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseChartDirective } from "ng2-charts";
import PieExample1 from "./examples/01-pie";
import BarExample2 from "./examples/02-bar";

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
}
