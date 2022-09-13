const { Unauthenticated } = require("../errors");
const Token = require("../models/Token");
const { verifyJWT, attachJWTtoCookies } = require("../utils/jwt");

const authenticatedUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  console.log(refreshToken);
  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken);
      req.user = payload;
      return next();
    }
    const payload = verifyJWT(refreshToken);

    const existingToken = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: payload.user.userId,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new Unauthenticated("Unauthenticated User");
    }
    attachJWTtoCookies({
      res,
      payload: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    throw new Unauthenticated("Unauthenticated User");
  }
};

module.exports = authenticatedUser;
