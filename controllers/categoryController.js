const createCategory = async (req, res) => {
  res.send("Create  category");
};

const getAllCategories = async (req, res) => {
  res.send("Get all categories");
};

const getSingleCategory = async (req, res) => {
  res.send("Get Single category");
};

const updateCategory = async (req, res) => {
  res.send("update category");
};

const deleteCategory = async (req, res) => {
  res.send("delete category");
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
