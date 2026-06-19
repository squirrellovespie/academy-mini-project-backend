import { Router } from "express";
import { ExpenseController } from "../controllers/expenseController.js";

const controller = new ExpenseController();

const router = Router();


router.get("/expenses", (req, res) => controller.getAll(req, res));
router.get("/expenses/:id", (req, res) => controller.getById(req, res));
router.get("/expenses/:id/details", (req, res) => controller.getDetailsById(req, res));
router.post("/expenses", (req, res) => controller.create(req, res));
router.put("/expenses/:id", (req, res) => controller.update(req, res));
router.delete("/expenses/:id", (req, res) => controller.delete(req, res));


export default router;