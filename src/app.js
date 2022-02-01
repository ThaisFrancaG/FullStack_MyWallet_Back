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

app.post("/login", async (req, res) => {
  const loginInfo = req.body;
  console.log(loginInfo);
  try {
    res.status(200).send("Foi recebido");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log("Server is running at http://localhost:5000/");
});
