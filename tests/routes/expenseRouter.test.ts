import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const serviceMocks = vi.hoisted(() => ({
	findAll: vi.fn(),
	findById: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	deleteExpense: vi.fn(),
}));

vi.mock("../../src/services/expenseService.js", () => {
	class MockExpenseService {
		findAll = serviceMocks.findAll;
		findById = serviceMocks.findById;
		create = serviceMocks.create;
		update = serviceMocks.update;
		deleteExpense = serviceMocks.deleteExpense;
	}

	return {
		ExpenseService: MockExpenseService,
	};
});

import app from "../../src/app.js";

describe("expense routes", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("GET /expenses returns expense array", async () => {
		serviceMocks.findAll.mockResolvedValue([
			{ id: 1, date: "2024-01-01", description: "Test", user: "Alice", amount: 25 },
		]);

		const res = await request(app).get("/expenses");

		expect(res.status).toBe(200);
		expect(res.body.data).toEqual([
			{ id: 1, date: "2024-01-01", description: "Test", user: "Alice" },
		]);
	});

	it("GET /expenses/:id returns expense", async () => {
		serviceMocks.findById.mockResolvedValue({
			id: 1,
			date: "2024-01-01",
			description: "Test",
			user: "Alice",
			amount: 25,
		});

		const res = await request(app).get("/expenses/1");

		expect(res.status).toBe(200);
		expect(res.body.data).toEqual({
			id: 1,
			date: "2024-01-01",
			description: "Test",
			user: "Alice",
		});
	});

	it("GET /expenses/:id returns 404 when not found", async () => {
		serviceMocks.findById.mockResolvedValue(undefined);

		const res = await request(app).get("/expenses/999");

		expect(res.status).toBe(404);
	});

	it("GET /expenses/abc returns 400 from param validation", async () => {
		const res = await request(app).get("/expenses/abc");

		expect(res.status).toBe(400);
		expect(Array.isArray(res.body.errors)).toBe(true);
		expect(res.body.errors[0].field).toBe("id");
	});

	it("POST /expenses returns 201 when body is valid", async () => {
		serviceMocks.create.mockResolvedValue({
			id: 4,
			date: "2024-02-01",
			description: "Created",
			user: "Bob",
			amount: 99,
		});

		const res = await request(app).post("/expenses").send({
			date: "2024-02-01",
			description: "Created",
			user: "Bob",
			amount: 99,
		});

		expect(res.status).toBe(201);
	});

	it("POST /expenses returns 400 for invalid body", async () => {
		const res = await request(app).post("/expenses").send({
			date: "",
			user: "Bob",
			amount: 99,
		});

		expect(res.status).toBe(400);
		expect(Array.isArray(res.body.errors)).toBe(true);
	});

	it("PUT /expenses/:id returns 200 when updated", async () => {
		serviceMocks.update.mockResolvedValue({
			id: 1,
			date: "2024-03-01",
			description: "Updated",
			user: "Alice",
			amount: 10,
		});

		const res = await request(app).put("/expenses/1").send({
			date: "2024-03-01",
			description: "Updated",
			user: "Alice",
			amount: 10,
		});

		expect(res.status).toBe(200);
	});

	it("DELETE /expenses/:id returns 204 when removed", async () => {
		serviceMocks.deleteExpense.mockResolvedValue(true);

		const res = await request(app).delete("/expenses/1");

		expect(res.status).toBe(204);
	});
});
