import {HttpUtils} from "../utils/http-utils.js";
import type {OpenNewRouteType} from "../types/open-new-route.type.js";
import type {OperationType} from "../types/operation-category.type.js";
import type {DefaultResponseType} from "../types/default-response.type.js";
import type {PeriodType} from "../types/period.type.js";

export class Transactions {
    private readonly openNewRoute: OpenNewRouteType;
    private selectedId: number | null = null;

    // кнопки фильтра
    private todayButton: HTMLElement | null = null;
    private weekButton: HTMLElement | null = null;
    private monthButton: HTMLElement | null = null;
    private yearButton: HTMLElement | null = null;
    private allButton: HTMLElement | null = null;
    private intervalButton: HTMLElement | null = null;
    private dateFromInput: HTMLInputElement | null = null;
    private dateToInput: HTMLInputElement | null = null;

    private createIncomeButton: HTMLElement | null = null;
    private createExpenseButton: HTMLElement | null = null;

    private popupElement: HTMLElement | null = null;
    private deleteConfirmButton: HTMLElement | null = null;
    private deleteCancelButton: HTMLElement | null = null;

    private tbody: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        // кнопки фильтра
        this.todayButton = document.getElementById('today');
        this.weekButton = document.getElementById('week');
        this.monthButton = document.getElementById('month');
        this.yearButton = document.getElementById('year');
        this.allButton = document.getElementById('all');
        this.intervalButton = document.getElementById('interval');
        this.dateFromInput = document.getElementById('date-1-input') as HTMLInputElement | null;
        this.dateToInput = document.getElementById('date-2-input') as HTMLInputElement | null;

        // обработчики для кнопок
        this.todayButton?.addEventListener('click', () => this.getOperations());
        this.weekButton?.addEventListener('click', () => this.getOperations('week'));
        this.monthButton?.addEventListener('click', () => this.getOperations('month'));
        this.yearButton?.addEventListener('click', () => this.getOperations('year'));
        this.allButton?.addEventListener('click', () => this.getOperations('all'));
        this.dateFromInput?.addEventListener('change', () => this.getOperations('interval'));
        this.dateToInput?.addEventListener('change', () => this.getOperations('interval'));

        // две кнопки и обработчики
        this.createIncomeButton = document.getElementById('create-income');
        this.createExpenseButton = document.getElementById('create-expenses');

        this.createIncomeButton?.addEventListener('click', () => this.openNewRoute('/transactions-create?type=income'));
        this.createExpenseButton?.addEventListener('click', () => this.openNewRoute('/transactions-create?type=expense'));

        // попап подтверждения удаления, по аналогии с incomes
        this.popupElement = document.getElementById('transactions-popup');

        this.deleteConfirmButton = document.getElementById('popup-confirm-delete');
        this.deleteConfirmButton?.addEventListener('click', async () => {
            if (this.popupElement) {
                this.popupElement.style.display = 'none';
            }

            if (this.selectedId !== null) {
                await this.deleteRecord(this.selectedId);

                const row: HTMLElement | null = document.querySelector<HTMLElement>(`tr[data-id="${this.selectedId}"]`);
                if (row) {
                    row.remove();
                }
            }

            if (window.balanceInstance) {
                await window.balanceInstance.updateBalance();
            }
        });

        this.deleteCancelButton = document.getElementById('popup-cancel-delete');
        this.deleteCancelButton?.addEventListener('click', () => {
            if (this.popupElement) {
                this.popupElement.style.display = 'none';
            }
        });

        this.tbody = document.getElementById('tbody');

        this.getOperations().then();
    }

    private showOperations(operations: OperationType[]): void {
        const tbody: HTMLElement | null = this.tbody;
        if (!tbody) {
            return;
        }

        operations.forEach((operation: OperationType) => {
            const infoRow: HTMLTableRowElement = document.createElement('tr');   // весь ряд
            infoRow.dataset.id = String(operation.id);                           // чтобы находить строку при удалении

            const operationNumber: HTMLTableCellElement = document.createElement('td');  // id операции
            operationNumber.setAttribute('id', 'operation-number');
            operationNumber.innerText = String(operation.id);

            const typeTransaction: HTMLTableCellElement = document.createElement('td');  // тип
            typeTransaction.setAttribute('id', 'type-income');
            if (operation.type === 'expense') {
                typeTransaction.classList.add('type-expenses');
                typeTransaction.innerText = 'расход';
            } else {
                typeTransaction.classList.add('type-income');
                typeTransaction.innerText = 'доход';
            }

            const categoryTransaction: HTMLTableCellElement = document.createElement('td');  // категория
            categoryTransaction.setAttribute('id', 'category');
            categoryTransaction.innerText = operation.category ?? 'Без категории';

            const sum: HTMLTableCellElement = document.createElement('td');      // сумма
            sum.setAttribute('id', 'sum');
            sum.innerText = operation.amount + '$';

            const dateTransaction: HTMLTableCellElement = document.createElement('td');  // дата
            dateTransaction.setAttribute('id', 'date');
            const [year, month, day] = operation.date.split('-');
            dateTransaction.innerText = `${day}.${month}.${year}`;

            const comment: HTMLTableCellElement = document.createElement('td');  // коммент
            comment.setAttribute('id', 'comment');
            comment.innerText = operation.comment;

            const actionTransaction: HTMLTableCellElement = document.createElement('td');  // действия
            actionTransaction.setAttribute('id', 'action-transaction');

            const deleteTransaction: HTMLButtonElement = document.createElement('button');  // удалить
            deleteTransaction.setAttribute('id', 'delete-transaction-button');
            deleteTransaction.classList.add('delete-transaction');
            deleteTransaction.innerHTML = `<svg width="13" height="15" viewBox="0 0 13 15" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M4 5.5C4.27614 5.5 4.5 5.72386 4.5 6V12C4.5 12.2761 4.27614 12.5 4 12.5C3.72386 12.5 3.5 12.2761 3.5 12V6C3.5 5.72386 3.72386 5.5 4 5.5Z"
                                        fill="black" />
                                    <path
                                        d="M6.5 5.5C6.77614 5.5 7 5.72386 7 6V12C7 12.2761 6.77614 12.5 6.5 12.5C6.22386 12.5 6 12.2761 6 12V6C6 5.72386 6.22386 5.5 6.5 5.5Z"
                                        fill="black" />
                                    <path
                                        d="M9.5 6C9.5 5.72386 9.27614 5.5 9 5.5C8.72386 5.5 8.5 5.72386 8.5 6V12C8.5 12.2761 8.72386 12.5 9 12.5C9.27614 12.5 9.5 12.2761 9.5 12V6Z"
                                        fill="black" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M13 3C13 3.55228 12.5523 4 12 4H11.5V13C11.5 14.1046 10.6046 15 9.5 15H3.5C2.39543 15 1.5 14.1046 1.5 13V4H1C0.447715 4 0 3.55228 0 3V2C0 1.44772 0.447715 1 1 1H4.5C4.5 0.447715 4.94772 0 5.5 0H7.5C8.05229 0 8.5 0.447715 8.5 1H12C12.5523 1 13 1.44772 13 2V3ZM2.61803 4L2.5 4.05902V13C2.5 13.5523 2.94772 14 3.5 14H9.5C10.0523 14 10.5 13.5523 10.5 13V4.05902L10.382 4H2.61803ZM1 3V2H12V3H1Z"
                                        fill="black" />
                                </svg>`;

            const editTransaction: HTMLButtonElement = document.createElement('button');  // редактировать
            editTransaction.setAttribute('id', 'edit-transaction-button');
            editTransaction.classList.add('edit-transaction');
            editTransaction.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"
                                        fill="black" />
                                </svg>`;

            // сборка
            actionTransaction.appendChild(deleteTransaction);
            actionTransaction.appendChild(editTransaction);

            infoRow.appendChild(operationNumber);
            infoRow.appendChild(typeTransaction);
            infoRow.appendChild(categoryTransaction);
            infoRow.appendChild(sum);
            infoRow.appendChild(dateTransaction);
            infoRow.appendChild(comment);
            infoRow.appendChild(actionTransaction);

            tbody.appendChild(infoRow);

            // слушатели на кнопки
            deleteTransaction.addEventListener('click', () => {
                this.selectedId = operation.id;
                if (this.popupElement) {
                    this.popupElement.style.display = 'flex';
                }
            });
            editTransaction.addEventListener('click', () => {
                this.openNewRoute('/transactions-edit?id=' + operation.id + '&type=' + operation.type);
            });
        });
    }

    private async getOperations(period: PeriodType | null = null): Promise<void> {
        let url: string = '/operations';

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
        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response) {
            alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
            return;
        }

        if (this.tbody) {
            this.tbody.innerHTML = '';
        }
        this.showOperations(result.response);
    }

    private async deleteRecord(operationId: number): Promise<void> {
        const result = await HttpUtils.request<DefaultResponseType>('/operations/' + operationId, 'DELETE', true);
        if (result.redirect) {
            await this.openNewRoute(result.redirect);
            return;
        }
        if (result.error || !result.response || result.response.error) {
            alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        }
    }
}
