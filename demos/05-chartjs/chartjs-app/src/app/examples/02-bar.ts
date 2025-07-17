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
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                color: "#333",
                font: {
                    size: 12,
                    weight: "normal",
                },
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: "#f5f5f5",
            titleColor: "#000",
            bodyColor: "#000",
            borderColor: "#ccc",
            borderWidth: 1,
            callbacks: {
                label: (tooltipItem) => {
                    return `The quartely sales is ${tooltipItem.raw}`;
                },
            },
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