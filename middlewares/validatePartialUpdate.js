import Cars from "../models/Cars.js";
import isValidPlate from "../utils/isValidPlate.js";

const validatePartialUpdate = async (req, res, next) => {
  const updates = req.body;
  const errors = [];

  // Remove null or empty fields (except model if brand is provided)
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

  // Validate brand-model dependency
  if (hasBrand) {
    if (!hasModel || updates.model.trim() === "") {
      errors.push("model must also be informed");
    }
  }

  // Model alone, but empty
  if (hasModel && updates.model.trim() === "") {
    errors.push("model cannot be empty");
  }

  // Validate year
  if ("year" in updates) {
    const { year } = updates;
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 9 || year > currentYear + 1) {
      errors.push(
        `year must be between ${currentYear - 9} and ${currentYear + 1}`
      );
    }
  }

  // Validate plate
  if ("plate" in updates) {
    const { plate } = updates;

    if (!isValidPlate(plate)) {
      errors.push("plate must be in the correct format ABC-1C34");
    } else {
      const existingCar = await Cars.findOne({ where: { plate } });

      if (existingCar) {
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
