import express from "express";
import cors from "cors";
import connection from "./config/database.js";
import carRoutes from "./routes/carRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const port = 3000;

app.use(express.json());

// Allow requests from all origins
app.use(cors());

// Register the car routes with the API prefix "/api/v1"
app.use("/api/v1", carRoutes);

app.use(errorHandler);

// Connect to the database and start the server
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
