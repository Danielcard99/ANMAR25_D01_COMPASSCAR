import isValidPlate from "../utils/isValidPlate.js";

const validateCarData = (req, res, next) => {
  const { brand, model, plate, year } = req.body;
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (!brand || brand.trim() === "") {
    errors.push("brand is required");
  }

  if (typeof model !== "string") {
    errors.push("model must be a string");
  } else if (model.trim() === "") {
    errors.push("model is required");
  }

  if (typeof year !== "number") {
    errors.push("year must be a number");
  } else if (year < currentYear - 9 || year > currentYear + 1) {
    errors.push(
      `year must be between ${currentYear - 9} and ${currentYear + 1}`
    );
  }

  if (!plate || plate.trim() === "") {
    errors.push("plate is required");
  } else if (!isValidPlate(plate)) {
    errors.push("plate must be in the correct format ABC-1C34");
  }

  if (errors.length) {
    return res.status(400).json({ errors: errors });
  }

  next();
};

export default validateCarData;
