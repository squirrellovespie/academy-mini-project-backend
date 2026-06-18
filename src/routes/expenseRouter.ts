import express from "express";  

type Expense = {
    id: string;
    date: string;
    description: string;
    user: string;
};

const expenses: Expense[] = [
    {
        id: "1",
        date: "2024-01-01",
        description: "Lunch with client",
        user: "Alice"
    },
    {
        id: "2",
        date: "2024-01-02",
        description: "Office supplies",
        user: "Bob"
    },
    {
        id: "3",
        date: "2024-01-03",
        description: "Travel to conference",
        user: "Charlie"
    }
];

const router = express.Router();

router.get("/expenses", (req, res) => {
    res.json(expenses);
    res.status(200).json({ message: "Expenses retrieved successfully", data: expenses });
});

router.get("/expenses/:id", (req, res) => {
    const { id } = req.params;
    const expense = expenses.find(e => e.id === id);
    if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
    res.status(200).json({ message: "Expense retrieved successfully", data: expense });
});

router.post("/expenses", (req, res) => {
    const { date, description, user } = req.body;
    if (!date || !description || !user) {
        return res.status(400).json({ message: "Missing required fields: date, description, user" });
    }

    const newExpense: Expense = {
        id: (expenses.length + 1).toString(),
        date,
        description,
        user
    };

    expenses.push(newExpense);
    res.status(201).json({ message: "Expense created successfully", data: newExpense });
});

router.put("/expenses/:id", (req, res) => {
    const { id } = req.params;
    const { date, description, user } = req.body;

    const expenseIndex = expenses.findIndex(e => e.id === id);
    if (expenseIndex === -1) {
        return res.status(404).json({ message: "Expense not found" });
    }

    if (!date || !description || !user) {
        return res.status(400).json({ message: "Missing required fields: date, description, user" });
    }

    const updatedExpense: Expense = {
        id,
        date,
        description,
        user
    };

    expenses[expenseIndex] = updatedExpense;
    res.json({ message: "Expense updated successfully", data: updatedExpense });
});

router.delete("/expenses/:id", (req, res) => {
    const { id } = req.params;
    const expenseIndex = expenses.findIndex(e => e.id === id);
    if (expenseIndex === -1) {
        return res.status(404).json({ message: "Expense not found" });
    }

    expenses.splice(expenseIndex, 1);
    res.json({ message: "Expense deleted successfully" });
});

export default router;