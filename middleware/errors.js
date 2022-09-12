const { CustomError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandling = (err, req, res, next) => {
  let errors = {
    message: err.message || StatusCodes.INTERNAL_SERVER_ERROR,
    statusCode: err.statusCode || "Something wrong, please try later",
  };

  // ValidationError
  if (err.name === "ValidationError") {
    const validationErrorList = Object.values(err.errors);
    errors.message = validationErrorList
      .map((item) => {
        return item.message;
      })
      .join(",");
    errors.statusCode = StatusCodes.BAD_REQUEST;
  }

  // DuplicateError
  if (err.code === 11000 && err.code) {
    errors.message = `${Object.keys(
      err.keyValue
    )} field has been duplicated, please choose another one`;
    errors.statusCode = StatusCodes.BAD_REQUEST;
  }

  // NotFound Error
  if (err.name === "CastError") {
    errors.message = `Cannot find item with id: ${err.value}`;
    errors.statusCode = StatusCodes.NOT_FOUND;
  }
  return res.status(errors.statusCode).json({ msg: errors.message });
};

module.exports = errorHandling;
