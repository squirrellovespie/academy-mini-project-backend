import { Request, Response } from "express";
import { ExpenseService } from "../services/expenseService.js";
import { AmountExpenseResponseDto, createExpenseRequestDto, expenseResponseDto } from "../dtos/expenseDto.js";

export class ExpenseController {

    constructor(private expenseService: ExpenseService = new ExpenseService()) {}

    async getAll(req: Request, res: Response): Promise<void> {
        const expenses = await this.expenseService.findAll();
        const expensesDto: expenseResponseDto[] = expenses.map(expense => ({
            id: expense.id,
            date: expense.date,
            description: expense.description,
            user: expense.user
        }));
        res.status(200).json({ message: "Expenses retrieved successfully", data: expensesDto });
    };

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
            const expense = await this.expenseService.findById(Number(id));
            if (!expense) {
                res.status(404).json({ message: "Expense not found" });
                return;
            }
            const expenseDto: expenseResponseDto = {
                id: expense.id,
                date: expense.date,
                description: expense.description,
                user: expense.user
            };
            res.status(200).json({ message: "Expense retrieved successfully", data: expenseDto });
    };

    async getDetailsById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
            const expense = await this.expenseService.findById(Number(id));
            if (!expense) {
                res.status(404).json({ message: "Expense not found" });
                return;
            }
            const AmountExpenseDto: AmountExpenseResponseDto = {
                id: expense.id,
                date: expense.date,
                description: expense.description,
                user: expense.user,
                amount: expense.amount
            };
            res.status(200).json({ message: "Expense details retrieved successfully", data: AmountExpenseDto });
    };

    async create(req: Request, res: Response): Promise<void> {
        const { date, description, user, amount } = req.body;
        if (!date || !description || !user || amount === undefined) {
            res.status(400).json({ message: "Missing required fields: date, description, user, amount" });
            return;
        }
        const requestDto: createExpenseRequestDto = { date, description, user, amount };
        const newExpense = await this.expenseService.create(requestDto);
        const expenseDto: expenseResponseDto = {
                id: newExpense.id,
                date: newExpense.date,
                description: newExpense.description,
                user: newExpense.user
            };
        res.status(201).json({ message: "Expense created successfully", data: expenseDto });

    };

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { date, description, user, amount } = req.body;
        if (!date || !description || !user || amount === undefined) {
            res.status(400).json({ message: "Missing required fields: date, description, user, amount" });
            return;
        }
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid expense ID" });
            return;
        }
        const requestDto: createExpenseRequestDto = { date, description, user, amount };
        const updatedExpense = await this.expenseService.update(Number(id), requestDto);
        if (!updatedExpense) {
            res.status(404).json({ message: "Expense not found" });
            return;
        }
        const expenseDto: expenseResponseDto = {
                id: updatedExpense.id,
                date: updatedExpense.date,
                description: updatedExpense.description,
                user: updatedExpense.user
            };
        res.status(200).json({ message: "Expense updated successfully", data: expenseDto });
    };

    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid expense ID" });
            return;
        }
        try {
            await this.expenseService.deleteExpense(Number(id));
            res.status(200).json({ message: "Expense deleted successfully" });
        } catch (error) {
            if (error instanceof Error && error.message === "Expense not found") {
                res.status(404).json({ message: "Expense not found" });
                return;
            }
            res.status(500).json({ message: "Error deleting expense" });
        }
    };
}