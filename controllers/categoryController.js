const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const Category = require("../models/Category");

const createCategory = async (req, res) => {
  const category = await Category.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ category });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(StatusCodes.OK).json({ count: categories.length, categories });
};

const getSingleCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  const category = await Category.findOne({ _id: categoryId });
  if (!category) {
    throw new NotFound(`Not category can be found with id: ${categoryId}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  const category = await Category.findOneAndUpdate(
    { _id: categoryId },
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new NotFound(`Not category can be found with id: ${categoryId}`);
  }

  res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await Category.findOne({ _id: categoryId });

  if (!category) {
    throw new NotFound(`Not category can be found with id: ${categoryId}`);
  }

  await category.remove();

  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
