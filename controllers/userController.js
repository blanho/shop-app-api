const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const User = require("../models/User");
const checkUserAuthorization = require("../utils/checkAuthorization");
const path = require("path");

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
  // Find incoming user matches with user that is being found
  // Admin has the permission to get single user

  checkUserAuthorization(req.user, user);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserInfo = async (req, res) => {
  res.send("Update User");
};

const uploadUserImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequest("Not File Uploaded");
  }
  const image = Object.keys(req.files);
  if (!req.files[image].mimetype.startsWith("image")) {
    throw new BadRequest("Please upload an image");
  }
  const imagePath = path.join(
    __dirname,
    `../public/User/`,
    `${req.files[image].name}`
  );
  await req.files[image].mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/User/${req.files[image].name}` });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequest("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  // Admin has the permission to change user password
  checkUserAuthorization(req.user, user);

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
    throw new NotFound(`Cannot find this user with id: ${id}`);
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
  uploadUserImage,
};
