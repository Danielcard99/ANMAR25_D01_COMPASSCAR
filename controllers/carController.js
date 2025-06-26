import Cars from "../models/Cars.js";
import CarsItem from "../models/CarsItem.js";
import { Op } from "sequelize";
import toSnakeCase from "../utils/toSnakeCase.js";

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

export const addItemsToCar = async (req, res, next) => {
  const carId = Number(req.params.id);
  const itemsList = req.body;

  try {
    const carExists = await Cars.findByPk(carId);
    if (!carExists) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    await CarsItem.destroy({ where: { car_id: carId } });
    await CarsItem.bulkCreate(
      itemsList.map((name) => ({ name, car_id: carId }))
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const car = await Cars.findByPk(id, {
      include: {
        model: CarsItem,
        attributes: ["name"],
      },
    });

    if (!car) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    const plainCar = car.get({ plain: true });
    plainCar.items = plainCar.cars_items?.map((item) => item.name) || [];
    delete plainCar.cars_items;
    const formattedCar = toSnakeCase(plainCar);

    res.status(200).json(formattedCar);
  } catch (error) {
    next(error);
  }
};

export const getCars = async (req, res, next) => {
  try {
    const { year, final_plate, brand, page = 1, limit = 5 } = req.query;

    let where = {};

    if (year && !isNaN(parseInt(year, 10))) {
      where.year = { [Op.gte]: parseInt(year, 10) };
    }

    if (final_plate) {
      const cleanFinalPlate = final_plate?.toString().trim();
      const lastDigit =
        cleanFinalPlate.length > 0 ? cleanFinalPlate.slice(-1) : null;

      if (lastDigit && !isNaN(lastDigit)) {
        where.plate = { [Op.like]: `%${lastDigit}` };
      }
    }

    if (brand) {
      where.brand = { [Op.like]: `%${brand}%` };
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

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

export const updateCar = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const car = await Cars.findByPk(id);

    if (!car) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    await car.update(updates);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (req, res, next) => {
  const { id } = req.params;

  try {
    const car = await Cars.findByPk(id);

    if (!car) {
      return res.status(404).json({ errors: ["car not found"] });
    }

    await CarsItem.destroy({ where: { car_id: id } });
    await car.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
