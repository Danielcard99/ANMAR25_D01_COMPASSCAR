import express from "express";
import cors from "cors";
import Cars from "./models/Cars.js";
import CarsItem from "./models/CarsItem.js";
import connection from "./db/connection.js";

const app = express();
const port = 3000;

// Permitir todas as origens
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World NOVAMENTE!");
});

app.get("/dados", (req, res) => {
  res.json({ mensagem: "API acessível" });
});

connection
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${3000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
