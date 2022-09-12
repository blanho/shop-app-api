const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your first name"],
    minLength: 2,
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name"],
    minLength: 2,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  image: {
    type: String,
    default: "/UserUploads/default.jpg",
  },
  birthDate: {
    type: Date,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "seller", "user"],
  },
  verificationToken: {
    type: String,
  },
  isVerifiedUser: {
    type: Boolean,
    default: false,
  },
  verifiedUserDate: {
    type: Date,
  },
  passwordToken: {
    type: String,
  },
  passwordTokenExpiration: {
    type: Date,
  },
});

module.exports = mongoose.model("User", UserSchema);
