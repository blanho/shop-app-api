const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const user = await User.find({ role: "user" }).select(
    "-password -verificationToken -isVerifiedUser -verifiedUserDate"
  );
  res.status(StatusCodes.OK).json({ count: user.length, user });
};

const getSingleUser = async (req, res) => {
  res.send("Get Single User");
};

const showCurrentUser = async (req, res) => {
  res.send("Show current user");
};

const updateUserInfo = async (req, res) => {
  res.send("Update User");
};

const updatePassword = async (req, res) => {
  res.send("Update Password");
};

const deleteUser = async (req, res) => {
  res.send("Delete User");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserInfo,
  updatePassword,
  deleteUser,
};
