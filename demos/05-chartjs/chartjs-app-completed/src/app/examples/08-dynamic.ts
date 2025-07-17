import type { ChartData, ChartOptions } from 'chart.js';
import { signal } from '@angular/core';
import { BarChartType } from './types';

const chartType: BarChartType = 'bar';

// Reactive chart data using Angular signals
const chartData = signal<ChartData<BarChartType>>({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2],
      backgroundColor: '#42A5F5'
    }
  ]
});

const chartOptions: ChartOptions<BarChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1.5,
  plugins: {
    title: {
      display: true,
      text: 'Live Sales Data',
      color: 'darkblue',
      font: {
        size: 18,
        weight: 'bold'
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

function updateData() {
  // Simulate new data for demonstration
  const newValues = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50));
  chartData.update(data => ({
    ...data,
    datasets: [
      {
        ...data.datasets[0],
        data: newValues
      }
    ]
  }));
}

export default {
  chartType,
  chartData,
  chartOptions,
  updateData
};
