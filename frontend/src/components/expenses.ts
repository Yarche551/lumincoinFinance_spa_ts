import {HttpUtils} from "../utils/http-utils.js";
import type {OpenNewRouteType} from "../types/open-new-route.type.js";
import type {CategoryType} from "../types/category.type.js";
import type {DefaultResponseType} from "../types/default-response.type.js";

export class Expenses {
    private readonly openNewRoute: OpenNewRouteType;
    private selectedId: number | null = null;
    private gridElement: HTMLElement | null = null;
    private popupElement: HTMLElement | null = null;
    private deleteConfirmButton: HTMLElement | null = null;
    private deleteCancelButton: HTMLElement | null = null;
    private addCard: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.gridElement = document.getElementById('expenses-grid');
        this.popupElement = document.getElementById('expenses-popup');

        /* =============  Удаление категории - работает полностью ================ */
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
        }
        /* ======================================================================= */

        this.addCard = document.getElementById('add-card');
        if (this.addCard) {
            this.addCard.addEventListener('click', this.expensesCreate.bind(this));
        }
        this.getCategories();
    }

    private async getCategories(): Promise<void> {
        const result = await HttpUtils.request<CategoryType[]>('/categories/expense');
        if (result.redirect) return this.openNewRoute(result.redirect);
        if (result.error || !result.response) {
            return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
        }
        this.showRecords(result.response);
        console.log(result.response);
    }

    private showRecords(categories: CategoryType[]): void {
        const gridElement: HTMLElement | null = this.gridElement;
        if (!gridElement) {
            return;
        }
        const addCard: HTMLElement | null = document.getElementById('add-card');
        categories.forEach(category => {
            const card: HTMLDivElement = document.createElement('div');
            card.className = 'card';
            card.dataset.id = String(category.id);

            // заголовок категории
            const cardTitle: HTMLDivElement = document.createElement('h2');
            cardTitle.className = 'card-h2';
            cardTitle.innerText = category.title;

            // блок с кнопками
            const cardButtons: HTMLDivElement = document.createElement('div');
            cardButtons.className = 'card-buttons';

            // Редактировать
            const editLink: HTMLAnchorElement = document.createElement('a');
            editLink.className = 'btn btn-primary';
            editLink.setAttribute('href', '/expenses-edit?id=' + category.id);
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
        const result = await HttpUtils.request<DefaultResponseType>('/categories/expense/' + categoryId, 'DELETE', true);
        // const toDeleteCategotyButton = document.getElementById('to-delete-category');

        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            if (result.response) {
                console.log(result.response.message);
            }
            alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }
    }

    private expensesCreate() {
        this.openNewRoute('/expenses-create');
    }

}
