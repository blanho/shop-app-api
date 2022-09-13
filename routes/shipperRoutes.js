const express = require("express");
const router = express.Router();

const {
  createShipper,
  deleteShipper,
  getAllShippers,
  getSingleShipper,
  updateShipper,
} = require("../controllers/shipperController");

const authenticatedUser = require("../middleware/authentication");
const authorizedUser = require("../middleware/authorization");

router
  .route("/")
  .get(authenticatedUser, authorizedUser("admin"), getAllShippers)
  .post(authenticatedUser, authorizedUser("admin"), createShipper);

router
  .route("/:id")
  .patch(authenticatedUser, authorizedUser("admin"), updateShipper)
  .get(authenticatedUser, authorizedUser("admin"), getSingleShipper)
  .delete(authenticatedUser, authorizedUser("admin"), deleteShipper);

module.exports = router;
