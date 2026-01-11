export type ExpenseStatus = "PENDING" | "APPROVED" | "PAID";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  submittedBy: string;
  status: ExpenseStatus;
  createdAt: Date;
}
