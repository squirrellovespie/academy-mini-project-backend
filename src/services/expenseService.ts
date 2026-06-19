import { Expense } from "../models/expense.js";
import { createExpenseRequestDto } from "../dtos/expenseDto.js";

const expenses: Expense[] = [
    new Expense(1, "2024-01-01", "Lunch with client", "Alice"),
    new Expense(2, "2024-01-02", "Office supplies", "Bob"),
    new Expense(3, "2024-01-03", "Travel to conference", "Charlie")
];

export class ExpenseService {
    async findAll(): Promise<Expense[]> {
        return expenses;
    }
    async findById(id: number): Promise<Expense | undefined> {
        const expense = expenses.find(e => e.id === id);
        return expense || undefined;
    }
    async create(createExpenseRequestDto: createExpenseRequestDto): Promise<Expense> {
        const { date, description, user } = createExpenseRequestDto;
        const newExpense = new Expense(expenses.length + 1, date, description, user);
        expenses.push(newExpense);
        return newExpense;
    }
    async update(id: number, createExpenseRequestDto: createExpenseRequestDto): Promise<Expense | undefined> {
        const { date, description, user } = createExpenseRequestDto;
        const expenseIndex = expenses.findIndex(e => e.id === id);
        if (expenseIndex === -1) {
            throw new Error("Expense not found");
        }
        expenses[expenseIndex] = { id: id, date, description, user };
        return expenses[expenseIndex];
    }
    async deleteExpense(id: number): Promise<boolean> {
        const expenseIndex = expenses.findIndex(e => e.id === id);
        if (expenseIndex === -1) {
            throw new Error("Expense not found");
        }
        const deletedExpense = expenses.splice(expenseIndex, 1);
        return deletedExpense.length > 0;
    }
}