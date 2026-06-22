import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpenseController } from "../../src/controllers/expenseController.js";

const seededExpenses = [
  { id: 1, date: "2024-01-01", description: "Test Expense 1", user: "Alice", amount: 100 },
  { id: 2, date: "2024-01-02", description: "Test Expense 2", user: "Bob", amount: 50 },
];

function createMockRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
  } as any;
  res.status.mockReturnValue(res);
  return res;
}

describe("ExpenseController", () => {
  let mockService: any;
  let controller: ExpenseController;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockService = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteExpense: vi.fn(),
    };

    controller = new ExpenseController(mockService);
    mockReq = { params: {}, body: {}, query: {} };
    mockRes = createMockRes();
  });

  it("should return all expenses", async () => {
    mockService.findAll.mockResolvedValue(seededExpenses);

    await controller.getAll(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Expenses retrieved successfully",
      data: expect.any(Array),
    });
  });

  it("should return a status 500 if service throws an error", async () => {
    mockService.findAll.mockRejectedValue(new Error("Database error"));

    await controller.getAll(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });

  it("should return a specific expense by ID", async () => {
    const expense = seededExpenses[0];
    mockReq.params.id = "1";
    mockService.findById.mockResolvedValue(expense);

    await controller.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Expense retrieved successfully",
      data: {
        id: expense.id,
        date: expense.date,
        description: expense.description,
        user: expense.user,
      },
    });
  });

  it("should return 404 if expense not found by ID", async () => {
    mockReq.params.id = "999";
    mockService.findById.mockResolvedValue(undefined);

    await controller.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Expense not found",
    });
  });

  it("should return 400 with error message if id is not a number", async () => {
    mockReq.params.id = "abc";

    await controller.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid ID format",
    });
  });

  it("should return 500 when getById service throws", async () => {
    mockReq.params.id = "1";
    mockService.findById.mockRejectedValue(new Error("Database error"));

    await controller.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });

  it("should return 201 when create body is valid", async () => {
    mockReq.body = {
      date: "2024-02-01",
      description: "Created expense",
      user: "Alice",
      amount: 42,
    };
    mockService.create.mockResolvedValue({
      id: 10,
      ...mockReq.body,
    });

    await controller.create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Expense created successfully",
      data: {
        id: 10,
        date: "2024-02-01",
        description: "Created expense",
        user: "Alice",
      },
    });
  });

  it("should return 500 when create service throws", async () => {
    mockReq.body = {
      date: "2024-02-01",
      description: "Created expense",
      user: "Alice",
      amount: 42,
    };
    mockService.create.mockRejectedValue(new Error("Database error"));

    await controller.create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });

  it("should return 200 when update succeeds", async () => {
    mockReq.params.id = "1";
    mockReq.body = {
      date: "2024-03-01",
      description: "Updated expense",
      user: "Bob",
      amount: 55,
    };
    mockService.update.mockResolvedValue({
      id: 1,
      ...mockReq.body,
    });

    await controller.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Expense updated successfully",
      data: {
        id: 1,
        date: "2024-03-01",
        description: "Updated expense",
        user: "Bob",
      },
    });
  });

  it("should return 404 when update does not find expense", async () => {
    mockReq.params.id = "999";
    mockReq.body = {
      date: "2024-03-01",
      description: "Updated expense",
      user: "Bob",
      amount: 55,
    };
    mockService.update.mockResolvedValue(undefined);

    await controller.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Expense not found",
    });
  });

  it("should return 204 when delete succeeds", async () => {
    mockReq.params.id = "1";
    mockService.deleteExpense.mockResolvedValue(true);

    await controller.delete(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it("should return 404 when delete does not find expense", async () => {
    mockReq.params.id = "999";
    mockService.deleteExpense.mockResolvedValue(false);

    await controller.delete(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Expense not found",
    });
  });
});