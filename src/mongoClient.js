import { MongoClient } from "mongodb";
import dotenv from "dotenv";

//start mongo: mongod --dbpath ~/.mongo
const result = dotenv.config();

if (result.error) {
  console.log("Houve algum problema com a conexão do banco de dados");
}

const connectMongoClient = new MongoClient(process.env.MONGO_URI);

await connectMongoClient.connect();

const db = connectMongoClient.db("myWallet");

export default db;
