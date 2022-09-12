const mongoose = require("mongoose");

const CategorySchema = new mongoose.model({
  categoryName: {
    type: String,
    required: [true, "Please provide category name"],
    minLength: 2,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
