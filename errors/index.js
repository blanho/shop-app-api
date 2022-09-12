const BadRequest = require("./BadRequest");
const CustomError = require("./CustomErrors");
const NotFound = require("./NotFound");
const Unauthenticated = require("./Unauthenticated");
const Unauthorized = require("./Unauthorized");

module.exports = {
  BadRequest,
  CustomError,
  NotFound,
  Unauthenticated,
  Unauthorized,
};
