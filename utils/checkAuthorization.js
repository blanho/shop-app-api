const { Unauthorized } = require("../errors");

const checkUserAuthorization = (incomingUser, currentUser) => {
  if (
    incomingUser.role === "admin" ||
    incomingUser.userId === currentUser.toString()
  ) {
    return;
  }
  throw new Unauthorized("Unauthorized user to access this route");
};

module.exports = checkUserAuthorization;
