import express from "express";
import cors from "cors";
import Cars from "./models/Cars.js";
// import CarsItem from "./models/CarsItem.js";
import connection from "./db/connection.js";

const app = express();
const port = 3000;

app.use(express.json());

// Allow requests from all origins
app.use(cors());

// Middleware to validate car data before saving to the database
const validateCarData = (req, res, next) => {
  const { brand, model, plate, year } = req.body;
  const errors = [];
  const currentYear = new Date().getFullYear();

  // Validate brand
  if (!brand) {
    errors.push("brand is required");
  }

  // Validate model
  if (!model) {
    errors.push("model is required");
  }

  // Validate year
  if (!year) {
    errors.push("year is required");
  } else if (year < currentYear - 9 || year > currentYear + 1) {
    errors.push(
      `year must be between ${currentYear - 9} and ${currentYear + 1}`
    );
  }

  // Validate plate format
  if (!plate || plate.trim() === "") {
    errors.push("plate is required");
  } else if (!/^[A-Z]{3}-\d[A-Z0-9]\d{2}$/.test(plate)) {
    errors.push("plate must be in the correct format ABC-1C34");
  }

  // If validation errors exist, return a  400 Bad Reques response
  if (errors.length) {
    return res.status(400).json({ errors: errors });
  }

  next();
};

// Route to register a new car
app.post("/api/v1/cars", validateCarData, async (req, res) => {
  const { brand, model, plate, year } = req.body;
  
  try {
    const existingCar = await Cars.findOne({ where: { plate } });

    if (existingCar) {
      return res.status(409).json({ errors: ["car already registered"] });
    }

    await Cars.create({ brand, model, plate, year });

    const newCar = await Cars.findOne({
      order: [["id", "DESC"]],
      raw: true,
    });

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: "Error registering car" });
  }
});

// Connect to the database and start the server
connection
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}!`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
