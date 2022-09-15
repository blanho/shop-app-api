const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updatePassword,
  updateUserInfo,
  deleteUser,
} = require("../controllers/userController");

const authenticatedUser = require("../middleware/authentication");
const authorizedUser = require("../middleware/authorization");

const { uploadImageToCloud } = require("../utils/multer");

router.get("/", authenticatedUser, authorizedUser("admin"), getAllUsers);

router.get("/showUser", authenticatedUser, showCurrentUser);

router.patch(
  "/updateUser",
  authenticatedUser,
  uploadImageToCloud.single("image"),
  updateUserInfo
);

router.patch("/updatePassword", authenticatedUser, updatePassword);

router
  .route("/:id")
  .delete(authenticatedUser, authorizedUser("admin"), deleteUser)
  .get(authenticatedUser, getSingleUser);

module.exports = router;
