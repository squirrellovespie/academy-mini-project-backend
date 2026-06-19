import { Router } from "express";
import { ExpenseController } from "../controllers/expenseController.js";
import { validateParams, validateBody } from "../middleware/validate.js";
import { createExpenseSchema, idParamSchema } from "../dtos/expenseDto.js";

const controller = new ExpenseController();

const router = Router();


router.get("/expenses", (req, res) => controller.getAll(req, res));
router.get("/expenses/:id", validateParams(idParamSchema), controller.getById.bind(controller));
router.get("/expenses/:id/details", validateParams(idParamSchema), controller.getDetailsById.bind(controller));
router.post("/expenses", validateBody(createExpenseSchema), controller.create.bind(controller));
router.put("/expenses/:id", validateParams(idParamSchema), validateBody(createExpenseSchema), controller.update.bind(controller));
router.delete("/expenses/:id", validateParams(idParamSchema), controller.delete.bind(controller));


export default router;