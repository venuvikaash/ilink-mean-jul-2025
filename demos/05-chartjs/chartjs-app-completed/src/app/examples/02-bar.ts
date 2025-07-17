import type { ChartData, ChartOptions } from 'chart.js';
import { BarChartType } from './types';

const chartType: BarChartType = 'bar';

const chartData: ChartData<BarChartType> = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: '2023',
      data: [65, 59, 80, 81],
      backgroundColor: '#42A5F5',
    },
    {
      label: '2024',
      data: [75, 69, 90, 95],
      backgroundColor: '#66BB6A',
    },
  ],
};

const chartOptions: ChartOptions<BarChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Quarterly Sales Comparison',
      color: 'darkblue',
      font: {
        size: 18,
        weight: 'bold'
      }
    },
    legend: {
      position: 'bottom'
    },
    tooltip: {
      enabled: true
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Quarter',
        color: '#333',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      ticks: {
        color: '#666',
        font: {
          size: 12
        }
      },
      grid: {
        display: true,
        color: '#e0e0e0',     // grid + axis line
        lineWidth: 1
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Sales (in thousands)',
        color: '#333',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      ticks: {
        color: '#666',
        font: {
          size: 12
        },
        stepSize: 10
      },
      grid: {
        display: true,
        color: '#e0e0e0',
        lineWidth: 1
      }
    }
  }
};

export default {
  chartType,
  chartData,
  chartOptions,
};
