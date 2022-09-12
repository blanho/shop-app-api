const { BadRequest, Unauthenticated } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const sendMailRegistration = require("../utils/verifyEmail");
const resetPasswordVerification = require("../utils/resetPassword");
const createUserPayload = require("../utils/createUserPayload");
const Token = require("../models/Token");
const { attachJWTtoCookies } = require("../utils/jwt");

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new BadRequest("Please provide all values");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequest("Email already exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = `http://localhost:3000`;
  const name = user.lastName.concat(" ", user.firstName);

  await sendMailRegistration({
    name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Success! Please check the email to verify your account" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("Please provide all values");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthenticated("Invalid Credentials");
  }

  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword || !user.isVerifiedUser) {
    throw new Unauthenticated("Invalid Credentials");
  }

  let refreshToken = "";
  const payload = createUserPayload(user);

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new Unauthenticated("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachJWTtoCookies({ res, payload, refreshToken });
    return res.status(StatusCodes.OK).json({ payload });
  }

  refreshToken = crypto.randomBytes(60).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const isValid = true;

  const token = await Token.create({
    refreshToken,
    userAgent,
    ip,
    user: user._id,
    isValid,
  });

  attachJWTtoCookies({ res, payload, refreshToken });

  res.status(StatusCodes.OK).json({ payload, token });
};

const logout = async (req, res) => {
  res.send("logout");
};

const verifyEmail = async (req, res) => {
  const { email, token } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.verificationToken !== token) {
    throw new Unauthenticated("Verification failed");
  }

  user.isVerifiedUser = true;
  user.verifiedUserDate = Date.now();
  user.verificationToken = "";

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Verify email successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const origin = `http://localhost:3000`;
    const passwordToken = crypto.randomBytes(40).toString("hex");
    const fiveMins = 1000 * 60 * 5;
    const passwordTokenExpiration = new Date(Date.now() + fiveMins);
    const name = user.lastName.concat(" ", user.firstName);

    user.passwordToken = passwordToken;
    user.passwordTokenExpiration = passwordTokenExpiration;

    await user.save();

    await resetPasswordVerification({
      name,
      email: user.email,
      token: user.passwordToken,
      origin,
    });
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for resetting password" });
};

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    throw new BadRequest("Please provide all values");
  }

  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === token &&
      user.passwordTokenExpiration > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpiration = null;

      await user.save();

      return res
        .status(StatusCodes.OK)
        .json({ msg: "Changed password successfully" });
    }
  }
  res.status(StatusCodes.BAD_REQUEST).json({ msg: "Something wrong" });
};

module.exports = {
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  register,
};
