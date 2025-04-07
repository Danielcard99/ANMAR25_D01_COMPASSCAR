import validateCarData from "../middlewares/validateCarData.js";
import validatePartialUpdate from "../middlewares/validatePartialUpdate.js";
import validateItems from "../middlewares/validateItems.js";
import express from "express";
import {
  createCar,
  addItemsToCar,
  getCarById,
  getCars,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";

const router = express.Router();

// Route to create a new car
router.post("/", validateCarData, createCar);

// Route to add or replace items for a car by ID
router.put("/:id/items", validateItems, addItemsToCar);

// Route to get a specific car by ID, including its items
router.get("/:id", getCarById);

// Route to get a paginated list of cars with optional filters
router.get("/", getCars);

// Route to partially update a car by ID
router.patch("/:id", validatePartialUpdate, updateCar);

// Route to delete a car and its associated items by ID
router.delete("/:id", deleteCar);

export default router;
