const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

const verifyJWT = (payload) => {
  return jwt.verify(payload, process.env.JWT_SECRET_KEY);
};

const attachJWTtoCookies = ({ res, payload, refreshToken }) => {
  const accessTokenJWT = createJWT(payload);
  const refreshTokenJWT = createJWT({
    user: { ...payload },
    refreshToken,
  });

  const thirtyMins = 1000 * 60 * 30;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + thirtyMins),
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneMonth),
  });
};

module.exports = { attachJWTtoCookies, createJWT, verifyJWT };
