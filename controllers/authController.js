const { BadRequest } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

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

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });
  res.status(StatusCodes.CREATED).json({ msg: "Created Successfully", user });
};

const login = async (req, res) => {
  res.send("login");
};

const logout = async (req, res) => {
  res.send("logout");
};

const verifyEmail = async (req, res) => {
  res.send("verify Email");
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
