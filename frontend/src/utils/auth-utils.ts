import config from "../config/config.js";
import type { UserInfoType } from "../types/user-info.type.js";
import type {RefreshResponseType} from "../types/auth-response.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoTokenKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    // просто void ? 
    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }


    public static getAuthInfo(key: string | null = null): string | Record<string, string | null> | null {
        if (key) {
            if ([this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
                return localStorage.getItem(key);
            }
            return null;
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey)
            };
        }
    }

    // сильные изменения
    public static async updateRefreshToken(): Promise<boolean> {
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        
        if (typeof refreshToken === 'string' && refreshToken) {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });
            if (response && response.status === 200) {
                const data = await response.json() as RefreshResponseType | null;
                if (data && data?.tokens) {
                    this.setAuthInfo(data.tokens.accessToken, data.tokens.refreshToken);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }
}