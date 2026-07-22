import {HttpUtils} from "../utils/http-utils.js";
import type {OpenNewRouteType} from "../types/open-new-route.type.js";
import type {CategoryType} from "../types/category.type.js";
import type {DefaultResponseType} from "../types/default-response.type.js";

export class IncomesEdit {
    private readonly openNewRoute: OpenNewRouteType;
    private categoryId: string | null = null;
    private inputTitleCategory: HTMLInputElement | null = null;
    private updateCategoryButton: HTMLElement | null = null;
    private cancelButton: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.categoryId = new URLSearchParams(window.location.search).get('id');

        this.inputTitleCategory = document.getElementById('input-category-title') as HTMLInputElement | null;

        this.updateCategoryButton = document.getElementById('save-category-button');
        if (this.updateCategoryButton) {
            this.updateCategoryButton.addEventListener('click', this.updateCategory.bind(this));
        }

        this.cancelButton = document.getElementById('cancel-button');
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', this.cancelCreate.bind(this));
        }

        if (!this.categoryId) {
            this.openNewRoute('/incomes');
            return;
        }
        this.getCategory().then();
    }

    // тут вставка прежнего названия в инпут
    private async getCategory(): Promise<void> {
        const result = await HttpUtils.request<CategoryType>('/categories/income/' + this.categoryId);
        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response) {
            alert('Возникла ошибка при загрузке категории. Обратитесь в поддержку');
            return;
        }
        if (this.inputTitleCategory) {
            this.inputTitleCategory.value = result.response.title;
        }
    }

    private async updateCategory(): Promise<void> {
        if (!this.inputTitleCategory) {
            return;
        }
        const titleValue: string = this.inputTitleCategory.value.trim();
        if (!titleValue) {
            this.inputTitleCategory.classList.add('is-invalid');
            return;
        } else {
            this.inputTitleCategory.classList.remove('is-invalid');
        }
        const result = await HttpUtils.request<CategoryType | DefaultResponseType>('/categories/income/' + this.categoryId, 'PUT', true, {
            title: titleValue,
        });
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response || (result.response as DefaultResponseType).error) {
            if (result.response) {
                console.log((result.response as DefaultResponseType).message);
            }
            alert('Возникла ошибка при обновлении категории. Обратитесь в поддержку');
            return;
        }
        await this.openNewRoute('/incomes');
    }

    private cancelCreate(): void {
        this.openNewRoute('/incomes');
    }
}