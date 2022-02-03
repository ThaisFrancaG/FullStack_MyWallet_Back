import express from "express";
import cors from "cors";
import joi from "joi";
import db from "./mongoClient.js";
import { signUp, login } from "./controllers/authControllers.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", signUp);

app.post("/login", login);

app.post("/", addIncome);

app.listen(5000, () => {
  console.log("Server is running at http://localhost:5000/");
});
