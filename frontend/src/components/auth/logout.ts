import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import type {OpenNewRouteType} from "../../types/open-new-route.type.js";
import type {DefaultResponseType} from "../../types/default-response.type.js";

export class Logout {
    private readonly openNewRoute: OpenNewRouteType;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.logout().then();
    }

    private async logout(): Promise<void> {
        await HttpUtils.request<DefaultResponseType>('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });
        AuthUtils.removeAuthInfo();
        await this.openNewRoute('/login');
    }
}