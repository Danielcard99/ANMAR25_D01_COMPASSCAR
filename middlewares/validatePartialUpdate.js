import Cars from "../models/Cars.js";

const validatePartialUpdate = async (req, res, next) => {
  const updates = req.body;
  const errors = [];

  const hasBrand = "brand" in updates;
  const hasModel = "model" in updates;

  // If updating brand or model, both must be present
  if (hasBrand && !hasModel) {
    errors.push("model must also be informed");
  }

  // Validate year range
  if ("year" in updates) {
    const { year } = updates;
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 9 || year > currentYear + 1) {
      errors.push(
        `year must be between ${currentYear - 9} and ${currentYear + 1}`
      );
    }
  }

  // Validate plate format and uniqueness
  if ("plate" in updates) {
    const { plate } = updates;

    if (!/^[A-Z]{3}-\d[A-Z0-9]\d{2}$/.test(plate)) {
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
