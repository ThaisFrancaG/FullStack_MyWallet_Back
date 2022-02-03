import db from "../mongoClient.js";
import joi from "joi";
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

export async function signUp(req, res) {
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
}

export async function login(req, res) {
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
}
