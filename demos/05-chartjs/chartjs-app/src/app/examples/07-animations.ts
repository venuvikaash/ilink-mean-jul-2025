import type { ChartData, ChartOptions } from "chart.js";
import { BarChartType } from "./types";

const chartType: BarChartType = "bar";

const chartData: ChartData<BarChartType> = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
        {
            label: "Users Online",
            data: [12, 19, 3, 5, 8],
            backgroundColor: "#42A5F5",
        },
    ],
};

const chartOptions: ChartOptions<BarChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    plugins: {
        title: {
            display: true,
            text: "Daily Online Users",
            color: "darkblue",
            font: {
                size: 18,
                weight: "bold",
            },
        },
        legend: {
            display: false,
        },
    },
    animation: {
        duration: 4000, // Total duration of animation in ms
        easing: "easeOutQuart", // Easing function for animation
    },
    animations: {
        x: {
            type: "number",
            easing: "easeOutBounce",
            duration: 1000,
            from: -50,
        },
        y: {
            type: "number",
            easing: "easeInOutElastic",
            duration: 4000,
            from: 100,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Users",
            },
        },
        x: {
            title: {
                display: true,
                text: "Day of Week",
            },
        },
    },
};

export default {
    chartType,
    chartData,
    chartOptions,
};