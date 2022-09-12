const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    enum: ["admin", "user"],
    default: "user",
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

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatched = await bcrypt.compare(candidatePassword, this.password);
  return isMatched;
};

module.exports = mongoose.model("User", UserSchema);
