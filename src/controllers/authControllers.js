import db from "../mongoClient.js";
import { ObjectId } from "mongodb";
import joi from "joi";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

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
      return res
        .status(422)
        .send(
          "Houve um erro com seu cadastro. Confirme se informou um e-mail válido"
        );
    }
    //conferir se o email já está em uso
    let checkEmail = await db
      .collection("currentUsers")
      .findOne({ email: signupInfo.email });
    console.log(checkEmail);

    if (checkEmail) {
      return res
        .status(418)
        .send(
          "Por favor, utilize um formato de e-mail válido. Se o erro persistir, tente um endereço de e-mail diferente"
        );
    }
    //mudar a senha para algo encriptografado
    const salt = await bcrypt.genSalt(5);
    const seasonedHash = await bcrypt.hash(signupInfo.password, salt);
    //https://en.wikipedia.org/wiki/Salt_(cryptography)#:~:text=In%20cryptography%2C%20a%20salt%20is,to%20safeguard%20passwords%20in%20storage.&text=Salting%20is%20one%20such%20protection,randomly%20generated%20for%20each%20password.
    delete signupInfo["passwordConfirmation"];
    delete signupInfo["password"];

    await db
      .collection("currentUsers")
      .insertOne({ ...signupInfo, password: seasonedHash });

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

  try {
    const validation = loginSchema.validate(loginInfo);
    if (validation.error) {
      return res.sendStatus(422);
    }
    //conferir se o usuário está no banco de dados
    const checkUser = await db
      .collection("currentUsers")
      .findOne({ email: loginInfo.email });
    if (!checkUser) {
      return res
        .status(401)
        .send("Login não autorizado. Confirme os dados enviados");
    }
    //Se o usuário existir, tem que conferir se a senha enviada pelo usuário bate com a senha salva e encriptada no servidor. PRa isso, tem que começar pegando o ID
    const userId = checkUser._id.toString();
    console.log(userId);
    const preSeasoned = await db
      .collection("currentUsers")
      .findOne({ _id: new ObjectId(userId) });

    let checkLogin = await bcrypt.compare(
      loginInfo.password,
      preSeasoned.password
    );

    if (!checkLogin) {
      return res
        .status(409)
        .send("Email ou senha incorreto. Confira as informações enviadas");
    }
    //se chegar aqui, a senha foi confirmada, e o usuário pode receber o token
    const userToken = uuid();
    //cada vez que é chamado, é retornado um token completamente diferente, então é bom salvar direto no objeto.
    console.log(userToken);
    //relacionar o token ao ID DE UM USUÁRIO e salvar num objeto a parte
    //mas antes, tem que conferir se o ID já tem um token e ,se tiver, substituir

    await db.collection("sessions").deleteOne({ userId: userId });

    await db
      .collection("sessions")
      .insertOne({ userId: userId, userToken: userToken });
    return res.status(200).send(userToken);

    // console.log("Já tem sessão, então tem que atualizar");

    // await db.collection("sessions").findOneAndReplace(
    //   { userId: new ObjectId(userId) },

    //   { userId: "Mudei", userToken: "Mudei" },
    //   { returnNewDocument: true }
    // );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
