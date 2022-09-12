const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomErrors");

class Unauthorized extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = Unauthorized;
