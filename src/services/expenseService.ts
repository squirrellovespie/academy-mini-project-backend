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

export class ExpenseService {
    async findAll(): Promise<any[]> {
        return expenses;
    }
    async findById(id: number): Promise<Expense | null> {
        const expense = expenses.find(e => e.id === id.toString());
        return expense || null;
    }
    async create(date: string, description: string, user: string): Promise<any> {
        const newExpense: Expense = {
            id: (expenses.length + 1).toString(),
            date,
            description,
            user
        };
        expenses.push(newExpense);
        return newExpense;
    }
    async update(id: number, date: string, description: string, user: string): Promise<any> {
        const expenseIndex = expenses.findIndex(e => e.id === id.toString());
        if (expenseIndex === -1) {
            throw new Error("Expense not found");
        }
        expenses[expenseIndex] = { id: id.toString(), date, description, user };
        return expenses[expenseIndex];
    }
    async deleteExpense(id: number): Promise<any> {
        const expenseIndex = expenses.findIndex(e => e.id === id.toString());
        if (expenseIndex === -1) {
            throw new Error("Expense not found");
        }
        const deletedExpense = expenses.splice(expenseIndex, 1);
        return deletedExpense[0];
    }
}