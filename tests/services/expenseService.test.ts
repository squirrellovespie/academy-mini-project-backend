import { describe, it, expect, beforeEach } from "vitest";
import { ExpenseService } from "../../src/services/expenseService";

describe("ExpenseService", () => {
    let expenseService: ExpenseService;

    beforeEach(() => {
        expenseService = new ExpenseService();
    });

    it("should return an array", async () => {
        const result = await expenseService.findAll();
        expect(Array.isArray(result)).toBe(true);
    });

    it("should return all seeded expenses", async () => {
    const result = await expenseService.findAll();
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
    });

    it("should return the correct expense when found by ID", async () => {
        const result = await expenseService.findById(1);
        expect(result).toBeDefined();
        expect(result?.id).toBe(1);
        expect(result?.description).toBe("Lunch with client");
    });

    it("should return undefined when expense not found by ID", async () => {
        const result = await expenseService.findById(999);
        expect(result).toBeUndefined();
    });

    it("should return a new expense with a generated id", async () => {
    const newExpense = { date: "2024-06-01", user: "John Doe", description: "Dinner with client", amount: 50 };

    const currentExpenses = [...(await expenseService.findAll())];
    const maxId = Math.max(...currentExpenses.map(e => e.id), 0);
    
    const created = await expenseService.create(newExpense);

    expect(created.id).toBe(maxId + 1);
    expect(created.description).toBe(newExpense.description);
    expect(created.amount).toBe(newExpense.amount);
    });

    it("should include the new expense in subsequent findAll results", async () => {
    const newExpense = { date: "2024-06-01", user: "John Doe", description: "Dinner with client", amount: 50 };

    const beforeCount = (await expenseService.findAll()).length;
    await expenseService.create(newExpense);
    const after = await expenseService.findAll();

    expect(after).toHaveLength(beforeCount + 1);
    expect(after.some(e =>
        e.date === newExpense.date &&
        e.user === newExpense.user &&
        e.description === newExpense.description &&
        e.amount === newExpense.amount
    )).toBe(true);
    });

    it("should return the updated expense when update is successful", async () => {
    const newExpense = { date: "2024-06-01", user: "John Doe", description: "Dinner with client", amount: 50 };
    const created = await expenseService.create(newExpense);

    const updatedData = { date: "2024-06-02", user: "John Doe", description: "Updated Dinner", amount: 60 };
    const updated = await expenseService.update(created.id, updatedData);

    expect(updated).toBeDefined();
    expect(updated?.id).toBe(created.id);
    expect(updated?.description).toBe(updatedData.description);
    expect(updated?.amount).toBe(updatedData.amount);
    });
    
    it("should return undefined when trying to update a non-existent expense", async () => {
        const nonExistentId = 999;
        const updateData = { date: "2024-06-02", user: "John Doe", description: "Updated Dinner", amount: 60 };
        await expect(expenseService.update(nonExistentId, updateData)).resolves.toBeUndefined();
    });
    
    it("should return true when delete is successful", async () => {
        const newExpense = { date: "2024-06-01", user: "John Doe", description: "Dinner with client", amount: 50 };
        const created = await expenseService.create(newExpense);

        const result = await expenseService.deleteExpense(created.id);
        expect(result).toBe(true);
    });

    it("should return false when trying to delete a non-existent expense", async () => {
        const nonExistentId = 999;
        const result = await expenseService.deleteExpense(nonExistentId);
        expect(result).toBe(false);
    });
});