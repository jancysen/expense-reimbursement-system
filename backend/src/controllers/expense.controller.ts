import { Request, Response } from "express";

type ExpenseStatus = "PENDING" | "APPROVED" | "PAID";

type Expense = {
  id: number;
  title: string;
  amount: number;
  status: ExpenseStatus;
};

const expenses: Expense[] = [];

export const getExpenses = (req: Request, res: Response) => {
  res.json(expenses);
};

export const createExpense = (req: Request, res: Response) => {
  const { title, amount } = req.body;

  if (!title || !amount) {
    return res.status(400).json({ message: "Title and amount required" });
  }

  const newExpense: Expense = {
    id: Date.now(),
    title,
    amount,
    status: "PENDING",
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
};

export const approveExpense = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (expense.status !== "PENDING") {
    return res.status(400).json({ message: "Only pending expenses can be approved" });
  }

  expense.status = "APPROVED";
  res.json(expense);
};

export const payExpense = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (expense.status !== "APPROVED") {
    return res.status(400).json({ message: "Only approved expenses can be paid" });
  }

  expense.status = "PAID";
  res.json(expense);
};
