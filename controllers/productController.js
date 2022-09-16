const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Review = require("../models/Review");
const searchSortFilterProduct = require("../utils/searchSortFilter");

const cloudinary = require("../utils/cloudinary");

const createProduct = async (req, res) => {
  const { category: categoryId, supplier: supplierId } = req.body;

  const result = await cloudinary.uploader.upload(req.file.path, {
    use_filename: true,
    folder: "products",
  });

  if (!categoryId || !supplierId) {
    throw new BadRequest("Please provide supplier and category");
  }

  const category = await Category.findOne({
    _id: categoryId,
  });
  const supplier = await Supplier.findOne({
    _id: supplierId,
  });

  if (!category) {
    throw new NotFound(
      `No category can be found in products with id: ${categoryId}`
    );
  }
  if (!supplier) {
    throw new NotFound(
      `No supplier can be found in products with id: ${supplierId}`
    );
  }

  const product = await Product.create({
    ...req.body,
    user: req.user.userId,
    cloudinary_id: result.public_id,
    category: categoryId,
    supplier: supplierId,
    image: result.secure_url,
  });

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const { featured, productName, sort, fields, page, limit, numericFilters } =
    req.query;

  const productQuery = searchSortFilterProduct({
    featured,
    productName,
    sort,
    fields,
    page,
    limit,
    numericFilters,
  });

  const products = await productQuery;
  res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate({
    path: "reviews",
    select: "comment product",
  });
  if (!product) {
    throw new NotFound(`No product can be found with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  let product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFound(`No product can be found with id: ${productId}`);
  }

  await cloudinary.uploader.destroy(product.cloudinary_id);

  const result = await cloudinary.uploader.upload(req.file.path, {
    use_filename: true,
    folder: "products",
  });

  const image = result.secure_url;
  const cloudinary_id = result.public_id;

  product = await Product.findOneAndUpdate(
    { _id: productId },
    { ...req.body, image: image, cloudinary_id: cloudinary_id },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFound(`No product can be found with id: ${productId}`);
  }

  await cloudinary.uploader.destroy(product.cloudinary_id);
  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "Deleted product successfully" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getSingleProductReviews,
};
