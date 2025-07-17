import type { ChartData, ChartOptions } from "chart.js";
import { BubbleChartType } from "./types";

const chartType: BubbleChartType = "bubble";

const chartData: ChartData<BubbleChartType> = {
    datasets: [
        {
            label: "Dataset 1",
            data: [
                { x: 10, y: 20, r: 10 },
                { x: 15, y: 10, r: 15 },
                { x: 25, y: 30, r: 20 },
                { x: 35, y: 15, r: 12 },
                { x: 45, y: 25, r: 8 },
            ],
            backgroundColor: "#42A5F5",
        },
        {
            label: "Dataset 2",
            data: [
                { x: 12, y: 28, r: 10 },
                { x: 18, y: 12, r: 18 },
                { x: 30, y: 35, r: 15 },
                { x: 40, y: 20, r: 10 },
                { x: 50, y: 30, r: 6 },
            ],
            backgroundColor: "#66BB6A",
        },
    ],
};

const chartOptions: ChartOptions<BubbleChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Bubble Chart Example",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            position: "top",
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const data = context.raw as {
                        x: number;
                        y: number;
                        r: number;
                    };
                    return `x: ${data.x}, y: ${data.y}, r: ${data.r}`;
                },
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "X Axis",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            grid: {
                color: "#e0e0e0",
            },
        },
        y: {
            title: {
                display: true,
                text: "Y Axis",
                color: "#333",
                font: {
                    size: 14,
                    weight: "bold",
                },
            },
            grid: {
                color: "#e0e0e0",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};