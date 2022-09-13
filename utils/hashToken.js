const crypto = require("crypto");

const hashToken = (token) =>
  crypto.createHash("md5").update(token).digest("hex");

module.exports = hashToken;
