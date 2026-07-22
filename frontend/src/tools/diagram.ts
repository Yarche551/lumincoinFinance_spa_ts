import { Chart } from 'chart.js/auto';

const COLORS = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'];

export class Diagram {
    public incomesChart: Chart | null;
    public expensesChart: Chart | null;

    constructor() {
        this.incomesChart = this.createChart('myChart-incomes');
        this.expensesChart = this.createChart('myChart-expenses');
    }

    createChart(canvasId: string): Chart | null {
        const canvasElement = document.getElementById(canvasId);
        if (!(canvasElement instanceof HTMLCanvasElement)) {
            return null;
        }
        return new Chart(canvasElement, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: COLORS, // теперь внутри dataset
                }],
            },
        });
    }

    updateIncomes(labels: string[], data: number[]): void {
        this.updateChart(this.incomesChart, labels, data);
    }

    updateExpenses(labels: string[], data: number[]) {
        this.updateChart(this.expensesChart, labels, data);
    }

    updateChart(chart: Chart | null, labels: string[], data: number[]) {
        if (chart && data && chart.data.datasets[0]) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.update(); // перерисовка без пересоздания canvas
        }
    }
}
