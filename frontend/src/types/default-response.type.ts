export type ValidationErrorType = {
    key: string,
    message: string,
}

export type DefaultResponseType = {
    error: boolean,
    message: string,
    validation?: ValidationErrorType[],
}