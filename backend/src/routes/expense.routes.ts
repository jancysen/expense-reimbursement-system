import { Router } from "express";
import {
  getExpenses,
  createExpense,
  approveExpense,
  payExpense,
} from "../controllers/expense.controller";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", getExpenses);

// Employee
router.post("/", requireRole("EMPLOYEE"), createExpense);

// Manager
router.patch("/:id/approve", requireRole("MANAGER"), approveExpense);

// Admin
router.patch("/:id/pay", requireRole("ADMIN"), payExpense);

export default router;
