import {HttpUtils} from "../utils/http-utils.js";
import type {OpenNewRouteType} from "../types/open-new-route.type.js";
import type {CategoryType} from "../types/category.type.js";
import type {OperationType} from "../types/operation-category.type.js";
import type {DefaultResponseType} from "../types/default-response.type.js";

export class TransactionsEdit {
    private readonly openNewRoute: OpenNewRouteType;
    private operationId: string | null = null;

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
        this.createButton?.addEventListener('click', this.updateOperation.bind(this));

        this.cancelButton = document.getElementById('cancel-button');
        this.cancelButton?.addEventListener('click', this.cancelCreate.bind(this));

        this.inputType?.addEventListener('change', () => this.loadCategories());

        this.operationId = new URLSearchParams(window.location.search).get('id');

        if (!this.operationId) {
            this.openNewRoute('/transactions');
            return;
        }

        this.getOperation().then();
    }

    private async getOperation(): Promise<void> {
        if (!this.inputType || !this.inputAmount || !this.inputDate || !this.inputComment) {
            return;
        }

        const result = await HttpUtils.request<OperationType>('/operations/' + this.operationId);
        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response) {
            alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
            return;
        }

        this.inputType.value = result.response.type;
        this.inputAmount.value = String(result.response.amount);
        this.inputDate.value = result.response.date;
        this.inputComment.value = result.response.comment;
        await this.loadCategories(result.response.category ?? null);
    }

    private async loadCategories(selectedCategoryTitle: string | null = null): Promise<void> {
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

        const noCategoryOption: HTMLOptionElement = document.createElement('option');
        noCategoryOption.value = '';
        noCategoryOption.innerText = 'Без категории';
        inputCategory.appendChild(noCategoryOption);

        let matchedCategoryId: string = '';
        result.response.forEach((category: CategoryType) => {
            const option: HTMLOptionElement = document.createElement('option');
            option.value = String(category.id);
            option.innerText = category.title;
            if (category.title === selectedCategoryTitle) {
                matchedCategoryId = String(category.id);
            }
            inputCategory.appendChild(option);
        });

        inputCategory.value = matchedCategoryId;
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

    private async updateOperation(): Promise<void> {
        if (!this.inputType || !this.inputCategory || !this.inputAmount
            || !this.inputDate || !this.inputComment) {
            return;
        }
        if (!this.validateForm()) {
            return;
        }

        const result = await HttpUtils.request<OperationType | DefaultResponseType>('/operations/' + this.operationId, 'PUT', true, {
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
            alert('Возникла ошибка при обновлении операции. Обратитесь в поддержку');
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
