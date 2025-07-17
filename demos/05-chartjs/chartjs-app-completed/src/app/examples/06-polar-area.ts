import type { ChartData, ChartOptions } from 'chart.js';
import { PolarAreaChartType } from './types';

const chartType: PolarAreaChartType = 'polarArea';

const chartData: ChartData<PolarAreaChartType, number[], string> = {
  labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
  datasets: [
    {
      label: 'Scores',
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#FFCE56',
        '#E7E9ED',
        '#36A2EB'
      ]
    }
  ]
};

const chartOptions: ChartOptions<PolarAreaChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Polar Area Chart Example',
      color: 'darkblue',
      font: {
        size: 18,
        weight: 'bold'
      }
    },
    legend: {
      position: 'right',
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
