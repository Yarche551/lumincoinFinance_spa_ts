import {AuthUtils} from "./../../utils/auth-utils.js";
import {HttpUtils} from "./../../utils/http-utils.js";
import type {OpenNewRouteType} from "../../types/open-new-route.type.js";
import type {LoginResponseType, SignupResponseType} from "../../types/auth-response.type.js";

export class SignUp {
    private readonly openNewRoute: OpenNewRouteType;
    private nameElement: HTMLInputElement | null = null;
    private lastNameElement: HTMLInputElement | null = null;
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private passwordRepeatElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        // guard - после авторизации пускает куда угодно кроме страницы регистрации
        if (AuthUtils.getAuthInfo('accessToken')) {
            this.openNewRoute('/');
            return;
        }

        this.nameElement = document.getElementById('name') as HTMLInputElement | null;
        this.lastNameElement = document.getElementById('lastName') as HTMLInputElement | null;
        this.emailElement = document.getElementById('email') as HTMLInputElement | null;
        this.passwordElement = document.getElementById('password') as HTMLInputElement | null;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement | null;
        this.commonErrorElement = document.getElementById('common-error');
        const processButton: HTMLElement | null = document.getElementById('process-button');
        if (processButton) {
            processButton.addEventListener('click', this.signUp.bind(this));
        }
    }

    validateForm(): boolean {
        if (!this.nameElement || !this.lastNameElement || !this.emailElement
            || !this.passwordElement || !this.passwordRepeatElement) {
            return false;
        }

        let isValid: boolean = true;

        if (this.nameElement.value && this.nameElement.value.match(/^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/)) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.lastNameElement.value && this.lastNameElement.value.match(/^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/)) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }

        // для почты
        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        // для пароля
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z!@#$%^&*()_+\-=]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async signUp(): Promise<void> {
        if (!this.commonErrorElement || !this.nameElement || !this.lastNameElement
            || !this.emailElement || !this.passwordElement || !this.passwordRepeatElement) {
            return;
        }
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {

            // регистрация
            const signupResult = await HttpUtils.request<SignupResponseType>('/signup', 'POST', false, {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });
            if (signupResult.error || !signupResult.response || !signupResult.response.user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            // сразу логинимся теми же данными — за токенами
            const loginResult = await HttpUtils.request<LoginResponseType>('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: false,
            });
            if (loginResult.error || !loginResult.response || !loginResult.response.tokens
                || !loginResult.response.tokens.accessToken || !loginResult.response.tokens.refreshToken
                || !loginResult.response.user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            // сохраняем токены и на главную
            AuthUtils.setAuthInfo(
                loginResult.response.tokens.accessToken,
                loginResult.response.tokens.refreshToken,
                {
                    id: loginResult.response.user.id,
                    name: loginResult.response.user.name,
                    lastName: loginResult.response.user.lastName
                }
            );
            this.openNewRoute('/');
        }
    }
}