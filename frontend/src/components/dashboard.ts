import {HttpUtils} from "../utils/http-utils.js";
import {Diagram} from "../tools/diagram.js";
import type {OperationType, OperationCategoryType} from "../types/operation-category.type.js";
import type {PeriodType} from "../types/period.type.js";

export class Dashboard {
    private todayButton: HTMLElement | null = null;
    private weekButton: HTMLElement | null = null;
    private monthButton: HTMLElement | null = null;
    private yearButton: HTMLElement | null = null;
    private allButton: HTMLElement | null = null;
    private intervalButton: HTMLElement | null = null;
    private dateFromInput: HTMLInputElement | null = null;
    private dateToInput: HTMLInputElement | null = null;
    private readonly diagram: Diagram;

    constructor() {
        this.todayButton = document.getElementById('today');
        this.weekButton = document.getElementById('week');
        this.monthButton = document.getElementById('month');
        this.yearButton = document.getElementById('year');
        this.allButton = document.getElementById('all');
        this.intervalButton = document.getElementById('interval');
        this.dateFromInput = document.getElementById('date-1-input') as HTMLInputElement | null;
        this.dateToInput = document.getElementById('date-2-input') as HTMLInputElement | null;

        this.diagram = new Diagram();

        this.todayButton?.addEventListener('click', () => this.getOperations());
        this.weekButton?.addEventListener('click', () => this.getOperations('week'));
        this.monthButton?.addEventListener('click', () => this.getOperations('month'));
        this.yearButton?.addEventListener('click', () => this.getOperations('year'));
        this.allButton?.addEventListener('click', () => this.getOperations('all'));

        // фильтрация должна срабатывать при каждом изменении любой из дат интервала
        this.dateFromInput?.addEventListener('change', () => this.getOperations('interval'));
        this.dateToInput?.addEventListener('change', () => this.getOperations('interval'));

        this.getOperations();
    }

    private async getOperations(period: PeriodType | null = null): Promise<void> {
        let url = '/operations';
        if (period === 'interval') {
            if (!this.dateFromInput || !this.dateToInput) {
                return;
            }
            const params: URLSearchParams = new URLSearchParams({
                period: 'interval',
                dateFrom: this.dateFromInput.value,
                dateTo: this.dateToInput.value,
            });
            url = `/operations?${params.toString()}`;
        } else if (period) {
            url = `/operations?period=${period}`;
        }
        const result = await HttpUtils.request<OperationType[]>(url);
        if (result.error || !result.response) {
            return;
        }
        const operations: OperationType[] = result.response;

        const incomesByCategory: Record<string, number> = this.groupByCategory(operations, 'income');
        const expensesByCategory: Record<string, number> = this.groupByCategory(operations, 'expense');

        this.diagram.updateIncomes(Object.keys(incomesByCategory), Object.values(incomesByCategory));
        this.diagram.updateExpenses(Object.keys(expensesByCategory), Object.values(expensesByCategory));
    }

    groupByCategory(operations: OperationType[], type: OperationCategoryType): Record<string, number> {
        return operations
            .filter((operation: OperationType) => operation.type === type)
            .reduce((acc: Record<string, number>, operation: OperationType) => {
                const category: string = operation.category ?? 'Без категории';
                acc[category] = (acc[category] ?? 0) + Number(operation.amount);
                return acc;
            }, {});
    }
}
