export type OperationCategoryType = 'income' | 'expense';

export type OperationType = {
    id: number,
    type: OperationCategoryType,
    amount: number,
    date: string,
    comment: string,
    category?: string,
}