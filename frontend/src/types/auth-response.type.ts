import type { UserInfoType } from "./user-info.type.js";

export type TokensType = {
    accessToken: string,
    refreshToken: string,
}

export type LoginResponseType = {
    tokens: TokensType,
    user: UserInfoType,
}

export type RefreshResponseType = {
    tokens: TokensType,
}

export type SignupResponseType = {
    user: {
        id: number,
        email: string,
        name: string,
        lastName: string,
    },
}