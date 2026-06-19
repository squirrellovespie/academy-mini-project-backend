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
}