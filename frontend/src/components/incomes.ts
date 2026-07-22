import {HttpUtils} from "../utils/http-utils.js";
import type {OpenNewRouteType} from "../types/open-new-route.type.js";
import type {CategoryType} from "../types/category.type.js";
import type {DefaultResponseType} from "../types/default-response.type.js";

export class Incomes {
    private readonly openNewRoute: OpenNewRouteType;
    private selectedId: number | null = null;
    private gridElement: HTMLElement | null = null;
    private popupElement: HTMLElement | null = null;
    private deleteConfirmButton: HTMLElement | null = null;
    private deleteCancelButton: HTMLElement | null = null;
    private addCard: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.gridElement = document.getElementById('incomes-grid');
        this.popupElement = document.getElementById('incomes-popup');
        this.deleteConfirmButton = document.getElementById('popup-confirm-delete');

        if (this.deleteConfirmButton) {
            this.deleteConfirmButton.addEventListener('click', async () => {
                if (this.popupElement) {
                    this.popupElement.style.display = 'none';
                }

                const elem: HTMLElement | null = document.querySelector<HTMLElement>(`.card[data-id="${this.selectedId}"]`);
                if (elem) {
                    elem.remove();
                }

                if (this.selectedId !== null) {
                    await this.deleteCategory(this.selectedId);
                }
                if (window.balanceInstance) {
                    await window.balanceInstance.updateBalance();
                }
            });
        }

        this.deleteCancelButton = document.getElementById('popup-cancel-delete');
        if (this.deleteCancelButton) {
            this.deleteCancelButton.addEventListener('click', () => {
                if (this.popupElement) {
                    this.popupElement.style.display = 'none';
                }
            });

            this.addCard = document.getElementById('add-card');
            if (this.addCard) {
                this.addCard.addEventListener('click', this.incomesCreate.bind(this));
            }
        }
        this.getCategories().then();
    }

    private async getCategories() {
        const result = await HttpUtils.request<CategoryType[]>('/categories/income');
        if (result.redirect) await this.openNewRoute(result.redirect);
        if (result.error || !result.response) {
            alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
            return;
        }
        this.showRecords(result.response);
        console.log(result);
    }

    private showRecords(categories: CategoryType[]): void {
        const gridElement: HTMLElement | null = this.gridElement;
        if (!gridElement) {
            return;
        }

        const addCard: HTMLElement | null = document.getElementById('add-card');
        categories.forEach((category: CategoryType) => {
            const card: HTMLDivElement = document.createElement('div');
            card.className = 'card';
            card.dataset.id = String(category.id);

            // заголовок категории
            const cardTitle: HTMLHeadingElement = document.createElement('h2');
            cardTitle.className = 'card-h2';
            cardTitle.innerText = category.title;

            // блок с кнопками
            const cardButtons: HTMLDivElement = document.createElement('div');
            cardButtons.className = 'card-buttons';

            // Редактировать
            const editLink: HTMLAnchorElement = document.createElement('a');
            editLink.className = 'btn btn-primary';
            editLink.setAttribute('href', '/incomes-edit?id=' + category.id);
            editLink.setAttribute('id', 'edit-button')
            editLink.innerText = 'Редактировать';

            // Удалить
            const deleteButton: HTMLButtonElement = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Удалить';
            deleteButton.addEventListener('click', () => {
                this.selectedId = category.id;
                if (this.popupElement) {
                    this.popupElement.style.display = 'flex';
                }
            });

            // сборка
            cardButtons.appendChild(editLink);
            cardButtons.appendChild(deleteButton);

            card.appendChild(cardTitle);
            card.appendChild(cardButtons);

            gridElement.insertBefore(card, addCard);
        });
    }

    private async deleteCategory(categoryId: number): Promise<void> {
        const result = await HttpUtils.request<DefaultResponseType>('/categories/income/' + categoryId, 'DELETE', true);

        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            if (result.response) {
                console.log(result.response.message);
            }
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }
    }

    incomesCreate() {
        return this.openNewRoute('/incomes-create');
    }
}