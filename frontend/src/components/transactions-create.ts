import {HttpUtils} from "../utils/http-utils.js";
import type {OpenNewRouteType} from "../types/open-new-route.type.js";
import type {CategoryType} from "../types/category.type.js";
import type {OperationType} from "../types/operation-category.type.js";
import type {DefaultResponseType} from "../types/default-response.type.js";

export class TransactionsCreate {
    private readonly openNewRoute: OpenNewRouteType;

    // поля
    private inputType: HTMLSelectElement | null = null;
    private inputCategory: HTMLSelectElement | null = null;
    private inputAmount: HTMLInputElement | null = null;
    private inputDate: HTMLInputElement | null = null;
    private inputComment: HTMLInputElement | null = null;

    private createButton: HTMLElement | null = null;
    private cancelButton: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        // поля
        this.inputType = document.getElementById('input-type') as HTMLSelectElement | null;
        this.inputCategory = document.getElementById('input-category') as HTMLSelectElement | null;
        this.inputAmount = document.getElementById('input-amount') as HTMLInputElement | null;
        this.inputDate = document.getElementById('input-date') as HTMLInputElement | null;
        this.inputComment = document.getElementById('input-comment') as HTMLInputElement | null;

        this.createButton = document.getElementById('create-button');
        this.createButton?.addEventListener('click', this.createOperation.bind(this));

        this.cancelButton = document.getElementById('cancel-button');
        this.cancelButton?.addEventListener('click', this.cancelCreate.bind(this));

        this.inputType?.addEventListener('change', () => this.loadCategories());

        // считывание типа для инпута по умолчанию
        const typeFromUrl: string | null = new URLSearchParams(window.location.search).get('type');
        if (typeFromUrl && this.inputType) {
            this.inputType.value = typeFromUrl;
        }

        this.loadCategories().then();
    }

    private async loadCategories(): Promise<void> {
        if (!this.inputType || !this.inputCategory) {
            return;
        }
        const inputCategory: HTMLSelectElement = this.inputCategory;

        const result = await HttpUtils.request<CategoryType[]>('/categories/' + this.inputType.value);
        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response) {
            alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
            return;
        }

        inputCategory.innerHTML = '';
        result.response.forEach((category: CategoryType) => {
            const option: HTMLOptionElement = document.createElement('option');
            option.value = String(category.id);
            option.innerText = category.title;
            inputCategory.appendChild(option);
        });
    }

    private validateForm(): boolean {
        if (!this.inputCategory || !this.inputAmount || !this.inputDate || !this.inputComment) {
            return false;
        }

        let isValid: boolean = true;

        if (!this.inputCategory.value) {
            this.inputCategory.classList.add('is-invalid');
            isValid = false;
        } else {
            this.inputCategory.classList.remove('is-invalid');
        }
        if (!this.inputAmount.value.trim()) {
            this.inputAmount.classList.add('is-invalid');
            isValid = false;
        } else {
            this.inputAmount.classList.remove('is-invalid');
        }
        if (!this.inputDate.value) {
            this.inputDate.classList.add('is-invalid');
            isValid = false;
        } else {
            this.inputDate.classList.remove('is-invalid');
        }
        if (!this.inputComment.value.trim()) {
            this.inputComment.classList.add('is-invalid');
            isValid = false;
        } else {
            this.inputComment.classList.remove('is-invalid');
        }

        return isValid;
    }

    private async createOperation(): Promise<void> {
        if (!this.inputType || !this.inputCategory || !this.inputAmount
            || !this.inputDate || !this.inputComment) {
            return;
        }
        if (!this.validateForm()) {
            return;
        }

        const result = await HttpUtils.request<OperationType | DefaultResponseType>('/operations', 'POST', true, {
            type: this.inputType.value,
            category_id: Number(this.inputCategory.value),
            amount: this.inputAmount.value.trim(),
            date: this.inputDate.value,
            comment: this.inputComment.value.trim(),
        });

        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response || (result.response as DefaultResponseType).error) {
            alert('Возникла ошибка при добавлении операции. Обратитесь в поддержку');
            return;
        }

        if (window.balanceInstance) {
            await window.balanceInstance.updateBalance();
        }
        await this.openNewRoute('/transactions');
    }

    private cancelCreate(): void {
        this.openNewRoute('/transactions');
    }
}
