import type { ChartData, ChartOptions } from "chart.js";
import { BarChartType } from "./types";

const chartType: BarChartType = "bar";

const chartData: ChartData<BarChartType> = {
    labels: ["Product A", "Product B", "Product C"],
    datasets: [
        {
            label: "Units Sold",
            data: [65, 59, 80],
            backgroundColor: "#42A5F5",
        },
    ],
};

const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Product Sales with Data Labels",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            display: false,
        },
        datalabels: {
            color: "#000",
            anchor: "end",
            align: "top",
            font: {
                weight: "bold",
            },
            formatter: (value) => `${value} units`,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Units",
            },
        },
        x: {
            title: {
                display: true,
                text: "Products",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};