import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expense.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/expenses", expenseRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
