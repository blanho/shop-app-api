const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const User = require("../models/User");
const checkUserAuthorization = require("../utils/checkAuthorization");
const path = require("path");
const createUserPayload = require("../utils/createUserPayload");
const { attachJWTtoCookies } = require("../utils/jwt");
const deleteImagePath = require("../utils/deleteImagePath");

const Token = require("../models/Token");

const getAllUsers = async (req, res) => {
  const user = await User.find({ role: "user" }).select(
    "-password -verificationToken -isVerifiedUser -verifiedUserDate"
  );
  res.status(StatusCodes.OK).json({ count: user.length, user });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select(
    "-password -verificationToken -isVerifiedUser -verifiedUserDate"
  );

  if (!user) {
    throw new NotFound(`No user can be found with id: ${userId}`);
  }
  // Find incoming user matches with user that is being found
  // Admin has the permission to get single user

  checkUserAuthorization(req.user, user);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserInfo = async (req, res) => {
  const { firstName, lastName, birthDate, image } = req.body;

  const user = await User.findOne({ _id: req.user.userId });

  if (image) {
    if (!user.image.includes("default.jpg")) {
      deleteImagePath(user.image);
    }
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.image = image || user.image;
  user.birthDate = new Date(birthDate) || user.birthDate;

  await user.save();

  const token = await Token.findOne({ user: req.user.userId });
  const payload = createUserPayload(user);

  attachJWTtoCookies({ res, payload, refreshToken: token.refreshToken });

  res.status(StatusCodes.OK).json({ user: payload });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: req.user.userId });

  const isCorrectPassword = await user.comparePassword(oldPassword);
  if (!isCorrectPassword) {
    throw new BadRequest("Please provide a valid password");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Updated Password Successfully" });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFound(`No user can be found with id: ${id}`);
  }
  if (!user.image.includes("default.jpg")) {
    deleteImagePath(user.image);
  }
  await user.remove();

  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserInfo,
  updatePassword,
  deleteUser,
};
