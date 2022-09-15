const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Please provide category name"],
      minLength: 2,
    },
    description: {
      type: String,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

module.exports = mongoose.model("Category", CategorySchema);
