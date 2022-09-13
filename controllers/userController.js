const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors");
const User = require("../models/User");
const checkUserAuthorization = require("../utils/checkAuthorization");

const getAllUsers = async (req, res) => {
  const user = await User.find({ role: "user" }).select(
    "-password -verificationToken -isVerifiedUser -verifiedUserDate"
  );
  res.status(StatusCodes.OK).json({ count: user.length, user });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select(
    "-password -verificationToken -isVerifiedUser -verifiedUserDate"
  );

  if (!user) {
    throw new NotFound(`Cannot find this user with id: ${id}`);
  }
  checkUserAuthorization(req.user, user);

  res.status(StatusCodes.OK).json({ user });
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
