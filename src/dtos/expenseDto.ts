import { z } from "zod";

export const createExpenseSchema = z.object({
    date: z.string().min(1, "Date is required"),
    description: z.string().min(1, "Description is required"),
    user: z.string().min(1, "User is required"),
    amount: z.number().min(0, "Amount must be a non-negative number"),
});

export const idParamSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive integer"),
});


export type createExpenseRequestDto = z.infer<typeof createExpenseSchema>;

export type expenseResponseDto = {
    id: number;
    date: string;
    description: string;
    user: string;
};

export type amountExpenseResponseDto = {
    id: number;
    date: string;
    description: string;
    user: string;
    amount: number;
};