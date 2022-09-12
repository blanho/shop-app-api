const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.delete("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
