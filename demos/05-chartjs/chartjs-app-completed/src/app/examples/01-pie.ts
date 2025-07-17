import type { ChartData, ChartOptions } from 'chart.js';
import { PieChartType } from './types';

const chartType: PieChartType = 'pie';

const chartData: ChartData<PieChartType, number[], string | string[]> = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'],
    datasets: [
        {
            data: [300, 500, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }
    ]
};

const chartOptions: ChartOptions<PieChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: 'black',
                font: {
                    size: 14,
                }
            }
        },
        title: {
            display: true,
            text: 'Sales Distribution',
            color: 'darkblue',
            font: {
                size: 18,
                weight: 'bold',
            }
        },
        datalabels: {
            display: false
        }
    }
};

export default {
    chartType,
    chartData,
    chartOptions
};