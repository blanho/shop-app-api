const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomErrors");

class BadRequest extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
