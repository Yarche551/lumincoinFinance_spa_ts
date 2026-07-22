import config from "../config/config.js";
import {AuthUtils} from "./auth-utils.js";

// ai добавил
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpRequestResult<T = unknown> = {
    error: boolean;
    response: T | null;
    redirect?: string;
};

export class HttpUtils {
    static async request<T = unknown>(
        url: string,
        method: HttpMethod = 'GET',
        useAuth: boolean = true,
        body: unknown = null
    ): Promise<HttpRequestResult<T>> {
        const result: HttpRequestResult<T> = {
            error: false,
            response: null,
        };

        const params: RequestInit & { headers: Record<string, string> } = {
            method,
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token: string | null = null;
        if (useAuth) {
            const authInfo = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (typeof authInfo === 'string' && authInfo) {
                token = authInfo;
                params.headers['x-auth-token'] = token;
            }
        }

        if (body !== null) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json() as T;
        } catch {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    result.redirect = '/login';
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request<T>(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}