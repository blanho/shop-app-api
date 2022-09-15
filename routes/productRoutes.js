const express = require("express");
const router = express.Router();
const { uploadImageToCloud, uploadImageToLocal } = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} = require("../controllers/productController");

const authenticatedUser = require("../middleware/authentication");
const authorizedUser = require("../middleware/authorization");

router
  .route("/")
  .get(authenticatedUser, getAllProducts)
  .post(
    authenticatedUser,
    authorizedUser("admin"),
    uploadImageToCloud.single("image"),
    createProduct
  );

router
  .route("/:id")
  .patch(
    authenticatedUser,
    authorizedUser("admin"),
    uploadImageToCloud.single("image"),
    updateProduct
  )
  .get(authenticatedUser, getSingleProduct)
  .delete(authenticatedUser, authorizedUser("admin"), deleteProduct);

module.exports = router;
