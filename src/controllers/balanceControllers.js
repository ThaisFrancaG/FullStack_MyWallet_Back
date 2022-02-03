import db from "../mongoClient.js";
import { ObjectId } from "mongodb";
import joi from "joi";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export async function checkBalance(req, res) {
  console.log(req);
  console.log(req.headers);

  const sentToken = req.headers.authorization;
  try {
    res.status(200).send("Não há registros de entrada ou saída");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("Ocorreu um erro inesperado. Por favor, realize novo login");
  }
}
