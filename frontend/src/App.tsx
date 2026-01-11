import React, { useEffect, useState } from "react";
import "./App.css";

type Expense = {
  id: number;
  title: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID";
};

function App() {
  // Role & filter
  const [role, setRole] = useState<"EMPLOYEE" | "MANAGER" | "ADMIN">("EMPLOYEE");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "PAID">(
    "ALL"
  );

  // Form
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // Data
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [message, setMessage] = useState("");

  // Fetch expenses
  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:4000/expenses");
    const data = await res.json();
    setExpenses(data);
  };

  // Submit expense (Employee)
  const submitExpense = async () => {
    setMessage("");

    const res = await fetch("http://localhost:4000/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-role": "EMPLOYEE",
      },
      body: JSON.stringify({
        title,
        amount: Number(amount),
      }),
    });

    if (res.ok) {
      setTitle("");
      setAmount("");
      setMessage("Expense submitted successfully");
      fetchExpenses();
    } else {
      const data = await res.json();
      setMessage(data.message || "Error submitting expense");
    }
  };

  // Approve (Manager)
  const approveExpense = async (id: number) => {
    await fetch(`http://localhost:4000/expenses/${id}/approve`, {
      method: "PATCH",
      headers: { "x-role": "MANAGER" },
    });
    fetchExpenses();
  };

  // Pay (Admin)
  const payExpense = async (id: number) => {
    await fetch(`http://localhost:4000/expenses/${id}/pay`, {
      method: "PATCH",
      headers: { "x-role": "ADMIN" },
    });
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Apply filter
  const filteredExpenses =
    filter === "ALL"
      ? expenses
      : expenses.filter((e) => e.status === filter);

  return (
    <div className="container">
      <h1>Expense Reimbursement System</h1>

      {/* Role Selector */}
      <label>
        Select Role:{" "}
        <select value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
      </label>

      <hr />

      {/* EMPLOYEE */}
      {role === "EMPLOYEE" && (
        <>
          <h2>Employee Dashboard</h2>

          <input
            type="text"
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={submitExpense}>Submit Expense</button>
          {message && <p>{message}</p>}
        </>
      )}

      {/* MANAGER */}
      {role === "MANAGER" && (
        <>
          <h2>Manager Dashboard</h2>
          {expenses
            .filter((e) => e.status === "PENDING")
            .map((e) => (
              <div key={e.id}>
                {e.title} — ₹{e.amount}
                <button onClick={() => approveExpense(e.id)}>Approve</button>
              </div>
            ))}
        </>
      )}

      {/* ADMIN */}
      {role === "ADMIN" && (
        <>
          <h2>Admin Dashboard</h2>
          {expenses
            .filter((e) => e.status === "APPROVED")
            .map((e) => (
              <div key={e.id}>
                {e.title} — ₹{e.amount}
                <button onClick={() => payExpense(e.id)}>Pay</button>
              </div>
            ))}
        </>
      )}

      <hr />

      {/* FILTER */}
      <label>
        Filter by Status:{" "}
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="PAID">Paid</option>
        </select>
      </label>

      {/* ALL EXPENSES */}
      <h3>All Expenses</h3>
      <ul>
        {filteredExpenses.map((e) => (
          <li key={e.id}>
            {e.title} — ₹{e.amount} —{" "}
            <b className={`status-${e.status}`}>{e.status}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
