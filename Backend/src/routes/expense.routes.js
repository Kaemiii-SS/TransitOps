import { Router } from "express";
import { createExpense, getExpenses, getExpenseById, deleteExpense } from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("FINANCIAL_ANALYST"));

router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);

export default router;