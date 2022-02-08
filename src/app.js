import express from "express";
import cors from "cors";
import joi from "joi";
import db from "./mongoClient.js";
import { signUp, login } from "./controllers/authControllers.js";
import { checkBalance } from "./controllers/balanceControllers.js";
import { addIncome } from "./controllers/operationsControllers.js";
const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", signUp);
app.post("/login", login);

app.get("/checkBalance", checkBalance);

app.post("/", addIncome);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
