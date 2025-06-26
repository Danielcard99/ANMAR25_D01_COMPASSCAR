import Cars from "../models/Cars.js";
import isValidPlate from "../utils/isValidPlate.js";

const validatePartialUpdate = async (req, res, next) => {
  const updates = req.body;
  const errors = [];

  Object.keys(updates).forEach((key) => {
    if (
      (updates[key] === null || updates[key] === "") &&
      !(key === "model" && "brand" in updates)
    ) {
      delete updates[key];
    }
  });

  const hasBrand = "brand" in updates;
  const hasModel = "model" in updates;

  if (hasBrand) {
    if (!hasModel || updates.model.trim() === "") {
      errors.push("model must also be informed");
    }
  }

  if (hasModel && updates.model.trim() === "") {
    errors.push("model cannot be empty");
  }

  if ("year" in updates) {
    const { year } = updates;
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 9 || year > currentYear + 1) {
      errors.push(
        `year must be between ${currentYear - 9} and ${currentYear + 1}`
      );
    }
  }

  if ("plate" in updates) {
    const { plate } = updates;

    if (!isValidPlate(plate)) {
      errors.push("plate must be in the correct format ABC-1C34");
    } else {
      const { id } = req.params;
      const existingCar = await Cars.findOne({ where: { plate } });

      if (existingCar && existingCar.id !== Number(id)) {
        return res.status(409).json({ errors: ["car already registered"] });
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export default validatePartialUpdate;
