const validateItems = (req, res, next) => {
  const itemsList = req.body;
  const errors = [];

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

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};

export default validateItems;
