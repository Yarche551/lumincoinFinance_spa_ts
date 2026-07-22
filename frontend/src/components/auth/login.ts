import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import type {OpenNewRouteType} from "../../types/open-new-route.type.js";
import type {LoginResponseType} from "../../types/auth-response.type.js";

export class Login {
    private readonly openNewRoute: OpenNewRouteType;
    private emailInputElement: HTMLInputElement | null = null;
    private passwordInputElement: HTMLInputElement | null = null;
    private rememberMeElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        // guard - после авторизации пускает куда угодно кроме страницы регистрации
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        this.emailInputElement = document.getElementById('email') as HTMLInputElement | null;
        this.passwordInputElement = document.getElementById('password') as HTMLInputElement | null;
        this.rememberMeElement = document.getElementById('checkDefault') as HTMLInputElement | null;   // чекбокс
        this.commonErrorElement = document.getElementById('common-error');                             // ошибка всей формы

        const processButton: HTMLElement | null = document.getElementById('process-button');
        if (processButton) {
            processButton.addEventListener('click', this.login.bind(this));
        }
    }

    private validateForm(): boolean {
        if (!this.emailInputElement || !this.passwordInputElement) {
            return false;
        }

        let isValid: boolean = true;
        // для почты
        if (this.emailInputElement.value && this.emailInputElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailInputElement.classList.remove('is-invalid');
        } else {
            this.emailInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordInputElement.value) {
            this.passwordInputElement.classList.remove('is-invalid');
        } else {
            this.passwordInputElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    private async login(): Promise<void> {
        if (!this.commonErrorElement || !this.emailInputElement
            || !this.passwordInputElement || !this.rememberMeElement) {
            return;
        }

        this.commonErrorElement.style.display = 'none';
        if (!this.validateForm()) {
            return;
        }

        const result = await HttpUtils.request<LoginResponseType>('/login', 'POST', false, {
            email: this.emailInputElement.value,
            password: this.passwordInputElement.value,
            rememberMe: this.rememberMeElement.checked
        });

        if (result.error || !result.response || !result.response.tokens
            || !result.response.tokens.accessToken || !result.response.tokens.refreshToken
            || !result.response.user) {
            this.commonErrorElement.style.display = 'block';
            return;
        }

        AuthUtils.setAuthInfo(
            result.response.tokens.accessToken,
            result.response.tokens.refreshToken,
            {
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName
            }
        );
        await this.openNewRoute('/');
    }
}