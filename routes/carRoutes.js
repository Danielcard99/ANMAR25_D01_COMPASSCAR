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

router.post("/", validateCarData, createCar);

router.put("/:id/items", validateItems, addItemsToCar);

router.get("/:id", getCarById);

router.get("/", getCars);

router.patch("/:id", validatePartialUpdate, updateCar);

router.delete("/:id", deleteCar);

export default router;
