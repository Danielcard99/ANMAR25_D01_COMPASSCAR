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

export default validateCarData;
