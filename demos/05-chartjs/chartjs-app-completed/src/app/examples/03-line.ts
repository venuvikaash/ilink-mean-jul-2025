import type { ChartData, ChartOptions } from 'chart.js';
import { LineChartType } from './types';

const chartType: LineChartType = 'line';

const chartData: ChartData<LineChartType> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Website A',
      data: [30, 45, 60, 50, 70, 90],
      fill: false,
      borderColor: '#42A5F5',
      tension: 0.3,
      pointBackgroundColor: '#42A5F5'
    },
    {
      label: 'Website B',
      data: [40, 55, 50, 65, 85, 100],
      fill: false,
      borderColor: '#66BB6A',
      tension: 0.3,
      pointBackgroundColor: '#66BB6A'
    }
  ]
};

const chartOptions: ChartOptions<LineChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Traffic Comparison',
      color: 'darkblue',
      font: {
        size: 18,
        weight: 'bold'
      }
    },
    legend: {
      position: 'top'
    },
    tooltip: {
      enabled: true
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Month',
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
        color: '#e0e0e0'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Visitors (in thousands)',
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
        color: '#e0e0e0'
      }
    }
  }
};

export default {
  chartType,
  chartData,
  chartOptions
};