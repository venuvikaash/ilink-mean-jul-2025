import type { ChartData, ChartOptions } from "chart.js";
import { BarChartType } from "./types";

const chartType: BarChartType = "bar";

const chartData: ChartData<BarChartType> = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
        {
            label: "2023",
            data: [65, 59, 80, 81],
            backgroundColor: "#42A5F5",
        },
        {
            label: "2024",
            data: [75, 69, 90, 95],
            backgroundColor: "#66BB6A",
        },
    ],
};

const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Quarterly Sales Comparison",
            font: {
                size: 18,
            },
        },
        legend: {
            position: "top",
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Quarter",
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Sales (in thousands)",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};