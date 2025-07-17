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