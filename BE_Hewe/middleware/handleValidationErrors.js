const { validationResult } = require("express-validator");
const error = require("../utils/error");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorFieldsSet = new Set(errors.array().map((error) => error.path));
    const errorFieldsArray = Array.from(errorFieldsSet);
    return res.status(error.status.BadRequest).json({
      status: error.status.BadRequest,
      message: "Validation error",
      errorFieldsArray,
    });
  }

  next();
};

module.exports = { handleValidationErrors };
