import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import joi from "joi";

//start mongo: mongod --dbpath ~/.mongo
const result = dotenv.config();

if (result.error) {
  console.log("Houve algum problema com a conexão do banco de dados");
}

const connectMongoClient = new MongoClient(process.env.MONGO_URI);
let db;

connectMongoClient.connect(() => {
  db = connectMongoClient.db("myWallet");
});

const app = express();
app.use(express.json());
app.use(cors());

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

const signupSchema = joi.object({
  name: joi
    .string()
    .pattern(/[a-zA-Z]{3,}/)
    .required(),
  email: joi.string().required(),
  password: joi
    .string()
    .pattern(/[0-9a-zA-Z]{6,}/)
    .required(),
  passwordConfirmation: joi.string().required(),
});

app.post("/signup", async (req, res) => {
  const signupInfo = req.body;

  if (signupInfo.password != signupInfo.passwordConfirmation) {
    return res.status(401).send("As senhas devem ser iguais!");
  }
  try {
    const validation = signupSchema.validate(signupInfo);
    if (validation.error) {
      console.log("erro de outra coisa");
      return res
        .status(422)
        .send(
          "Houve um erro com seu cadastro. Confirme se informou um e-mail válido"
        );
    }
    //se chegou aqui, passou pelas validaçòes, e ai é hora de adicionar na coleção
    delete signupInfo["passwordConfirmation"];
    const toSignUp = {
      ...signupInfo,
    };

    console.log(toSignUp);
    await db.collection("currentUsers").insertOne({ toSignUp });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("Houve um erro com a sua solicitação. Tente novamente mais tarde");
  }
});

app.post("/login", async (req, res) => {
  const loginInfo = req.body;
  console.log(loginInfo);
  try {
    const validation = loginSchema.validate(loginInfo);
    if (validation.error) {
      return res.sendStatus(422);
    }
    //conferir se o usuário está no banco de dados
    res.status(200).send("Foi recebido");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log("Server is running at http://localhost:5000/");
});
