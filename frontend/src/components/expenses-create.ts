import {HttpUtils} from "../utils/http-utils.js";
import type {OpenNewRouteType} from "../types/open-new-route.type.js";
import type {CategoryType} from "../types/category.type.js";
import type {DefaultResponseType} from "../types/default-response.type.js";

export class ExpensesCreate {
    private readonly openNewRoute: OpenNewRouteType;
    private inputTitleCategory: HTMLInputElement | null = null;
    private createCategoryButton: HTMLElement | null = null;
    private cancelButton: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.inputTitleCategory = document.getElementById('input-category-title') as HTMLInputElement | null;

        this.createCategoryButton = document.getElementById('create-category-button');
        if (this.createCategoryButton) {
            this.createCategoryButton.addEventListener('click', this.createCategory.bind(this));
        }

        this.cancelButton = document.getElementById('cancel-button');
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', this.cancelCreate.bind(this));
        }
    }

    async createCategory(): Promise<void> {
        if (!this.inputTitleCategory) {
            return;
        }
        const titleValue = this.inputTitleCategory.value.trim();
        if (!titleValue) {
            this.inputTitleCategory.classList.add('is-invalid');
            return;
        } else {
            this.inputTitleCategory.classList.remove('is-invalid');
        }
        const result = await HttpUtils.request<CategoryType | DefaultResponseType>('/categories/expense', 'POST', true, {
            title: titleValue,
        });
        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response || (result.response as DefaultResponseType).error) {
            if (result.response) {
                console.log((result.response as DefaultResponseType).message);
            }
            alert('Возникла ошибка при добавлении категории. Обратитесь в поддержку');
            return;
        }
        return this.openNewRoute('/expenses');
    }

    private cancelCreate(): void {
        this.openNewRoute('/expenses');
    }
}
