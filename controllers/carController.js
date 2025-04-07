import Cars from "../models/Cars.js";
import CarsItem from "../models/CarsItem.js";
import { Op } from "sequelize";
import toSnakeCase from "../utils/toSnakeCase.js";

// Create a new car if the plate does not already exist
export const createCar = async (req, res, next) => {
  const { brand, model, plate, year } = req.body;

  try {
    const existingCar = await Cars.findOne({ where: { plate } });

    if (existingCar) {
      return res.status(409).json({ errors: ["car already registered"] });
    }

    const newCar = await Cars.create({ brand, model, plate, year });

    const plainCar = newCar.get({ plain: true });
    res.status(201).json(toSnakeCase(plainCar));
  } catch (error) {
    next(error);
  }
};

// Add or replace items for a specific car
export const addItemsToCar = async (req, res, next) => {
  const carId = Number(req.params.id);
  const itemsList = req.body;

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
    next(error);
  }
};

// Get a single car by ID, including its items
export const getCarById = async (req, res, next) => {
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
    const plainCar = car.get({ plain: true });
    plainCar.items = plainCar.cars_items?.map((item) => item.name) || [];
    delete plainCar.cars_items;
    const formattedCar = toSnakeCase(plainCar);

    res.status(200).json(formattedCar);
  } catch (error) {
    next(error);
  }
};

// Get a paginated list of cars, with optional filters (year, plate, brand)
export const getCars = async (req, res, next) => {
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

    // Filter by brand name (case-insensitive)
    if (brand) {
      where.brand = { [Op.like]: `%${brand}%` };
    }

    // Pagination logic
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Query the database
    const { count, rows } = await Cars.findAndCountAll({
      where,
      limit: limitNumber,
      offset: offset,
    });

    const formattedRows = rows.map((car) =>
      toSnakeCase(car.get({ plain: true }))
    );

    res.status(200).json({
      count,
      pages: Math.ceil(count / limitNumber),
      data: formattedRows,
    });
  } catch (error) {
    next(error);
  }
};

// Partially update fields of a car
export const updateCar = async (req, res, next) => {
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
    next(error);
  }
};

// Delete a car and all its related items
export const deleteCar = async (req, res, next) => {
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
    next(error);
  }
};
