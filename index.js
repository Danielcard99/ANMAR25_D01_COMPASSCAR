import express from "express";
import cors from "cors";
import connection from "./config/database.js";
import carRoutes from "./routes/carRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use("/api/v1/cars", carRoutes);

app.use(errorHandler);

connection
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}!`);
    });
  })
  .catch((err) => {
    console.log("Database connection error: ", err);
  });
