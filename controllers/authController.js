const { BadRequest, Unauthenticated } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const sendMailRegistration = require("../utils/verifyEmail");

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
  res.send("login");
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
  res.send("forgot password");
};

const resetPassword = async (req, res) => {
  res.send("reset password");
};

module.exports = {
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  register,
};
