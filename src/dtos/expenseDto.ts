export interface expenseResponseDto {
    id: number;
    date: string;
    description: string;
    user: string;
}

export interface createExpenseRequestDto {
    date: string;
    description: string;
    user: string;
    amount: number;
}

export interface AmountExpenseResponseDto {
    id: number;
    date: string;
    description: string;
    user: string;
    amount: number;
}