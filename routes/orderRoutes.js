const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} = require("../controllers/orderController");

const authenticatedUser = require("../middleware/authentication");
const authorizedUser = require("../middleware/authorization");

router
  .route("/")
  .post(authenticatedUser, createOrder)
  .get(authenticatedUser, authorizedUser("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticatedUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticatedUser, getSingleOrder)
  .patch(authenticatedUser, updateOrder);

module.exports = router;
