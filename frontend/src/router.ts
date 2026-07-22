import { Dashboard } from "./components/dashboard.js";
import { Login } from "./components/auth/login.js";
import { SignUp } from "./components/auth/sign-up.js";
import { Accordion } from "./tools/accordion.js";
import { ButtonsRow } from "./tools/buttons-row.js";
import { ProfilePopup } from "./tools/profile-popup.js";
import { Logout } from "./components/auth/logout.js";
import { AuthUtils } from "./utils/auth-utils.js";
import { Incomes } from "./components/incomes.js";
import { IncomesCreate } from "./components/incomes-create.js";
import { IncomesEdit } from "./components/incomes-edit.js";
import { Expenses } from "./components/expenses.js";
import { ExpensesEdit } from "./components/expenses-edit.js";
import { ExpensesCreate } from "./components/expenses-create.js";
import { Transactions } from "./components/transactions.js";
import { TransactionsCreate } from "./components/transactions-create.js";
import { TransactionsEdit } from "./components/transactions-edit.js";
import { Balance } from "./tools/balance.js";
import type { RouteType } from "./types/route.type.js";
import type { UserInfoType } from "./types/user-info.type.js";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private routes: RouteType[];

    constructor() {
        // сразу сохранение найденных эл-тов в конструкторе
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                load: () => {
                    new Dashboard();
                    new ButtonsRow();
                },
                useLayout: '/templates/layout.html',
                styles: [
                    'accordion.css',
                    'common.css',
                    'index.css',
                    'aside.css',
                ]
            },

            // login
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
                useLayout: false,
                styles: [
                    'common.css',
                    'auth.css',
                ]
            },

            // sign-up
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/sign-up.html',
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
                useLayout: false,
                styles: [
                    'common.css',
                    'auth.css',
                ]
            },

            // logout
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this))
                },
            },

            // incomes
            {
                route: '/incomes',
                title: 'Категории доходов',
                filePathTemplate: '/templates/incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomes-create',
                title: 'Создание категории доходов',
                useLayout: '/templates/layout.html',
                filePathTemplate: '/templates/incomes-create.html',
                load: () => {
                    new IncomesCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes-edit',
                title: 'Изменение категории доходов',
                useLayout: '/templates/layout.html',
                filePathTemplate: '/templates/incomes-edit.html',
                load: () => {
                    new IncomesEdit(this.openNewRoute.bind(this));
                }
            },

            // expenses
            {
                route: '/expenses',
                title: 'Категории расходов',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-create',
                title: 'Создание категории расходов',
                useLayout: '/templates/layout.html',
                filePathTemplate: '/templates/expenses-create.html',
                load: () => {
                    new ExpensesCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses-edit',
                title: 'Редактирование категории расходов',
                useLayout: '/templates/layout.html',
                filePathTemplate: '/templates/expenses-edit.html',
                load: () => {
                    new ExpensesEdit(this.openNewRoute.bind(this));
                }
            },

            // transactions
            {
                route: '/transactions',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/transactions.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ButtonsRow();
                    new Transactions(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/transactions-create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/transactions-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new TransactionsCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/transactions-edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/transactions-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new TransactionsEdit(this.openNewRoute.bind(this));
                }
            },
        ];
    }

    // отлов страницы
    public async activateRoute(): Promise<void> {
        const urlRoute: string = window.location.pathname; // какой роут щас - то есть current
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute); // соответствие массиву routes - проход по массиву

        // если роута нет - 404
        if (newRoute) {
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerHTML = newRoute.title;
            }
            const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            const publicRoutes = ['/login', '/sign-up'];
            if (!accessToken && !publicRoutes.includes(urlRoute)) {
                return this.openNewRoute('/login');
            }
            /* ==================
                  ВАЖНЫЙ КОД
               ================== */
            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;

                // Если корневой контейнер не найден — логируем и прекращаем работу
                if (!contentBlock) {
                    console.error('Container element with id "content" not found.');
                    return;
                }

                if (newRoute.useLayout) {
                    // защита от ошибки
                    if (typeof newRoute.useLayout === 'string' && this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                        new Accordion();
                        new ProfilePopup();
                        new Balance();
                        this.setUserName();
                        this.activateMenuItem();
                        contentBlock = document.getElementById('content-layout') || this.contentPageElement;
                    }
                }

                const templateHtml = await fetch(newRoute.filePathTemplate).then(response => response.text());
                if (contentBlock) {
                    contentBlock.innerHTML = templateHtml;
                }
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
            /* ==================
                  ВАЖНЫЙ КОД
               ================== */
        } else {
            window.location.href = '/'; // href добавлен
        }
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async openNewRoute(url: string): Promise<void> {
        history.pushState({}, '', url);
        await this.activateRoute(); // null, currentRoute было, хотя принимает 0 аргументов
    }


    private async clickHandler(e: Event): Promise<void> {
        let element: HTMLAnchorElement | null = null;

        // TypeScript не знает заранее, что там будет именно элемент.
        // Поэтому мы сначала делаем:
        const target = e.target as HTMLElement | null;
        // e.target - эл-т, куда кликнули (<a> или <span> внутри ссылки)
        // если кликнули прямо по ссылке — берём target
        // если кликнули по вложенному элементу внутри ссылки — берём parentNode или parentElement


        if (target?.nodeName === 'A') {
            element = e.target as HTMLAnchorElement;
        } else if (target?.parentNode?.nodeName === 'A') {
            element = target.parentNode as HTMLAnchorElement;
        }
        if (element) {
            e.preventDefault();

            const currentRoute: string = window.location.pathname;
            const url: string = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    // name, lastName в профиле
    // setUserName(): void {
    //     const userInfo: UserInfoType | null = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey));
    //     if (typeof userInfo === 'string') {
    //         if (userInfo.name && userInfo.fullNameElement) {
    //             document.querySelector('.full-name').innerText = userInfo.name + ' ' + userInfo.lastName;
    //         }
    //     }
    // }
    public setUserName(): void {
        /* возвращает не один конкретный тип, а либо строку, либо объект
        поэтому TS сам выводит тип из функции */
        const storedUserInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);

        if (typeof storedUserInfo === 'string') {
            const userInfo: UserInfoType | null = JSON.parse(storedUserInfo);
            const fullNameElement: HTMLElement | null = document.querySelector<HTMLElement>('.full-name');

            if (userInfo && userInfo.name && fullNameElement) {
                fullNameElement.innerText = `${userInfo.name} ${userInfo.lastName}`;
            }
        }
    }

    private activateMenuItem(): void {
        const currentRoute: string = window.location.pathname;
        document.querySelectorAll<HTMLElement>('.nav-link').forEach(link => {
            const href: string | null = link.getAttribute('href');
            link.classList.toggle('active', href === currentRoute);
        })
    }
}