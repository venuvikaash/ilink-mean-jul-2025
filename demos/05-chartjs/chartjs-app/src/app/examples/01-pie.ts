import type { ChartData } from "chart.js";
import { PieChartType } from "./types";

const chartType: PieChartType = "pie";

const chartData: ChartData<PieChartType, number[], string | string[]> = {
    labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    datasets: [
        {
            data: [300, 500, 100],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
    ],
};

export default {
    chartType,
    chartData,
};