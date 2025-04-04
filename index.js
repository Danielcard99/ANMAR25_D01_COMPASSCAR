import express from "express";
import cors from "cors";
import Cars from "./models/Cars.js";
import CarsItem from "./models/CarsItem.js";
import connection from "./db/connection.js";
import { Op } from "sequelize";
import validateCarData from "./middlewares/validateCarData.js";
import validatePartialUpdate from "./middlewares/validadePartialUpdate.js";

const app = express();
const port = 3000;

app.use(express.json());

// Allow requests from all origins
app.use(cors());

// Route to register a new car
app.post("/api/v1/cars", validateCarData, async (req, res) => {
  const { brand, model, plate, year } = req.body;

  try {
    const existingCar = await Cars.findOne({ where: { plate } });

    if (existingCar) {
      return res.status(409).json({ errors: ["car already registered"] });
    }

    const newCar = await Cars.create({ brand, model, plate, year });

    res.status(201).json(newCar);
  } catch (error) {
    console.log("Database error:", error);
    res.status(500).json({ errors: ["an internal server error occurred"] });
  }
});

// Route to add items to an existing car
app.put("/api/v1/cars/:id/items", async (req, res) => {
  const carId = Number(req.params.id);
  const itemsList = req.body;
  const errors = [];

  // Validate the provided items
  if (!Array.isArray(itemsList) || itemsList.length === 0) {
    errors.push("items is required");
  } else {
    if (itemsList.length > 5) {
      errors.push("items must be a maximum of 5");
    }

    if (new Set(itemsList).size !== itemsList.length) {
      errors.push("items cannot be repeated");
    }
  }

  // Return validation errors if any exist
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if the car exists in the database
    const carExists = await Cars.findByPk(carId);
    if (!carExists) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    // Remove old items and add new ones
    await CarsItem.destroy({ where: { car_id: carId } });
    await CarsItem.bulkCreate(
      itemsList.map((name) => ({ name, car_id: carId }))
    );

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["an internal server error occurred"] });
  }
});

// Route to get a car by its ID, including associated items.
app.get("/api/v1/cars/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find the car and include its associated items
    const car = await Cars.findByPk(id, {
      include: {
        model: CarsItem,
        attributes: ["name"],
      },
    });

    if (!car) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    // Format response to match API conventions
    const formattedCar = {
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      plate: car.plate,
      created_at: car.createdAt,
      items: car.cars_items.map((item) => item.name),
    };

    res.status(200).json(formattedCar);
  } catch (error) {
    console.log("Database error:", error);
    res.status(500).json({ errors: ["an internal server error occurred"] });
  }
});

// Route to get a paginated list of cars with optional filters
app.get("/api/v1/cars", async (req, res) => {
  try {
    const { year, final_plate, brand, page = 1, limit = 2 } = req.query;

    let where = {};

    // Filter by year (greater than or equal)
    if (year && !isNaN(parseInt(year, 10))) {
      where.year = { [Op.gte]: parseInt(year, 10) };
    }

    // Filter by final digit of the plate
    if (final_plate) {
      const cleanFinalPlate = final_plate?.toString().trim();
      const lastDigit =
        cleanFinalPlate.length > 0 ? cleanFinalPlate.slice(-1) : null;

      if (lastDigit && !isNaN(lastDigit)) {
        where.plate = { [Op.like]: `%${lastDigit}` };
      }
    }

    // Filter by brand (case-insensitive like)
    if (brand) {
      where.brand = { [Op.like]: `%${brand}%` };
    }

    // Pagination logic
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Cars.findAndCountAll({
      where,
      limit: limitNumber,
      offset: offset,
    });

    res
      .status(200)
      .json({ count, pages: Math.ceil(count / limitNumber), data: rows });
  } catch (error) {
    console.log("Database: error", error);
    res.status(500).json({ errors: ["an internal server error occurred"] });
  }
});

// Route to update car fields partially
app.patch("/api/v1/cars/:id", validatePartialUpdate, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if the car exists
    const car = await Cars.findByPk(id);

    if (!car) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    // Apply the updates
    await car.update(updates);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["internal server error"] });
  }
});

// Route to delete a car and its items
app.delete("/api/v1/cars/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if car exists
    const car = await Cars.findByPk(id);

    if (!car) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    // Delete related items and then the car
    await CarsItem.destroy({ where: { car_id: id } });
    await car.destroy();

    res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: ["internal server error"] });
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
    console.log("Database connection error: ", err);
  });
