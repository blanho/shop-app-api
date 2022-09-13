const { Unauthorized } = require("../errors");

const authorizedUser = (...roles) => {
  return async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    throw new Unauthorized("Unauthorized user to access this route");
  };
};

module.exports = authorizedUser;
