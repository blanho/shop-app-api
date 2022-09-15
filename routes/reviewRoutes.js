const express = require("express");
const router = express.Router();

const {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} = require("../controllers/reviewController");

const authenticatedUser = require("../middleware/authentication");
const authorizedUser = require("../middleware/authorization");

router.route("/").get(getAllReviews).post(authenticatedUser, createReview);

router
  .route("/:id")
  .patch(authenticatedUser, updateReview)
  .get(authenticatedUser, getSingleReview)
  .delete(authenticatedUser, deleteReview);

module.exports = router;
