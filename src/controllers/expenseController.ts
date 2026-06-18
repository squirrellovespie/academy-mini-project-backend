import {request, response} from "express";
import {ExpenseService} from "../services/expenseService.js";

const expenseService = new ExpenseService();

export const getAll = async (req: typeof request, res: typeof response) => {
    try {
        const expenses = await expenseService.findAll();
        res.status(200).json({ message: "Expenses retrieved successfully", data: expenses });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving expenses"});
    }
};

export const getById = async (req: typeof request, res: typeof response) => {
    const { id } = req.params;
    try {
        const expense = await expenseService.findById(Number(id));
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense retrieved successfully", data: expense });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving expense" });
    }
};

export const create = async (req: typeof request, res: typeof response) => {
    const { date, description, user } = req.body;
    if (!date || !description || !user) {
        return res.status(400).json({ message: "Missing required fields: date, description, user" });
    }
    try {
        const newExpense = await expenseService.create(date, description, user);
        res.status(201).json({ message: "Expense created successfully", data: newExpense });
    } catch (error) {
        res.status(500).json({ message: "Error creating expense" });
    }
};

export const update = async (req: typeof request, res: typeof response) => {
    const { id } = req.params;
    const { date, description, user } = req.body;
    if (!date || !description || !user) {
        return res.status(400).json({ message: "Missing required fields: date, description, user" });
    }
    if (isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid expense ID" });
    }
    try {
        const updatedExpense = await expenseService.update(Number(id), date, description, user);
        res.status(200).json({ message: "Expense updated successfully", data: updatedExpense });
    } catch (error) {
        if (error instanceof Error && error.message === "Expense not found") {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(500).json({ message: "Error updating expense" });
    }
};

export const deleteExpense = async (req: typeof request, res: typeof response) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid expense ID" });
    }
    try {
        await expenseService.deleteExpense(Number(id));
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        if (error instanceof Error && error.message === "Expense not found") {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(500).json({ message: "Error deleting expense" });
    }
};