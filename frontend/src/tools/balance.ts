import {HttpUtils} from "../utils/http-utils.js";
import type { OperationType } from "../types/operation-category.type.js";

export class Balance {
    public balanceText: HTMLElement | null;

    constructor() {
        this.balanceText = document.getElementById('balance');
        window.balanceInstance = this;
        this.getBalance().then();
    }

    async getBalance(): Promise<void> {
        const result = await HttpUtils.request<OperationType[]>('/operations?period=all');
        if (result.error || !result.response) {
            return;
        }

        const operations: OperationType[] = result.response;
        const balance = operations.reduce((sum: number, operation: OperationType) => {
            // добавлено
            if (operation.type === 'income') {
                return sum + Number(operation.amount);
            }
            if (operation.type === 'expense') {
                return sum - Number(operation.amount);
            }

            return sum;
        }, 0);

        if (this.balanceText) {
            this.balanceText.innerText = balance + '$';
        }
    }

    async updateBalance(): Promise<void> {
        await this.getBalance();
    }
}