import type { ChartData, ChartOptions } from 'chart.js';
import { DoughnutChartType } from './types';

const chartType: DoughnutChartType = 'doughnut';

const chartData: ChartData<DoughnutChartType, number[], string> = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Votes',
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverOffset: 8
    }
  ]
};

const chartOptions: ChartOptions<DoughnutChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Favorite Colors',
      color: 'darkblue',
      font: {
        size: 18,
        weight: 'bold'
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        color: '#333',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      enabled: true
    }
  }
};

export default {
  chartType,
  chartData,
  chartOptions
};
