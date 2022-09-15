const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest, Unauthorized } = require("../errors");
const User = require("../models/User");
const checkUserAuthorization = require("../utils/checkAuthorization");
const createUserPayload = require("../utils/createUserPayload");
const { attachJWTtoCookies } = require("../utils/jwt");

const Token = require("../models/Token");
const cloudinary = require("../utils/cloudinary");

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

  checkUserAuthorization(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserInfo = async (req, res, next) => {
  const { firstName, lastName } = req.body;

  const user = await User.findOne({ _id: req.user.userId });

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      folder: "users",
    });
    user.image = result.secure_url;
    if (!user.cloudinary_id) {
      user.cloudinary_id = result.public_id;
    } else {
      await cloudinary.uploader.destroy(user.cloudinary_id);
      user.cloudinary_id = result.public_id;
    }
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;

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

  if (user.role === "admin") {
    throw new Unauthorized("Cannot delete this user");
  }

  await cloudinary.uploader.destroy(user.cloudinary_id);
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
