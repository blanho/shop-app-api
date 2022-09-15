const express = require("express");
const router = express.Router();

const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  getSingleCategoryProducts,
} = require("../controllers/categoryController");

const authenticatedUser = require("../middleware/authentication");
const authorizedUser = require("../middleware/authorization");

router
  .route("/")
  .get(authenticatedUser, authorizedUser("admin"), getAllCategories)
  .post(authenticatedUser, authorizedUser("admin"), createCategory);

router.get(
  "/:id/products",
  authenticatedUser,
  authorizedUser("admin"),
  getSingleCategoryProducts
);

router
  .route("/:id")
  .patch(authenticatedUser, authorizedUser("admin"), updateCategory)
  .get(authenticatedUser, authorizedUser("admin"), getSingleCategory)
  .delete(authenticatedUser, authorizedUser("admin"), deleteCategory);

module.exports = router;
