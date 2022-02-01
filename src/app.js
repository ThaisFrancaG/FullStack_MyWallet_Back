import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import joi from "joi";

const result = dotenv.config();
if (result.error) {
  console.log("Houve algum problema com a conexão do banco de dados");
}

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
MongoClient.connect(() => {
  db = mongoClient.db("myWallet");
});

const app = express();
app.use(express.json());
app.use(cors());

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi
    .string()
    .pattern(/[0-9a-zA-Z]{6,}/)
    .message("Senha deve ter no mínimo 6 caracteres")
    .required(),
});

app.post("/login", async (req, res) => {
  const loginInfo = req.body;
  console.log(loginInfo);
  try {
    const validation = loginSchema.validate(loginInfo);
    if (validation.error) {
      res.status(422).send(validation.error.details[0].message);
    }
    res.status(200).send("Foi recebido");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log("Server is running at http://localhost:5000/");
});
