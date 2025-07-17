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

export default {
    chartType,
    chartData,
    chartOptions,
};