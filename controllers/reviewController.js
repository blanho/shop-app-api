const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");

const Product = require("../models/Product");
const Review = require("../models/Review");
const checkUserAuthorization = require("../utils/checkAuthorization");

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFound(`No product can be found with id: ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new BadRequest("Already submitted review for this product");
  }

  const review = await Review.create({
    ...req.body,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "productName description price",
  });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFound(`No review can be found with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFound(`No review can be found with id: ${reviewId}`);
  }
  checkUserAuthorization(req.user, review.user);

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFound(`No review can be found with id: ${reviewId}`);
  }
  checkUserAuthorization(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "Deleted review successfully" });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
