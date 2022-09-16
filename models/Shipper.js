const mongoose = require("mongoose");

const ShipperSchema = new mongoose.Schema(
  {
    shipperName: {
      type: String,
      required: [true, "Please provide shipper name"],
      minLength: 2,
    },
    phone: {
      type: String,
      required: [true, "Please provide shipper phone number"],
      minLength: 10,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ShipperSchema.virtual("orders", {
  localField: "_id",
  ref: "Order",
  foreignField: "shipper",
  justOne: false,
});

module.exports = mongoose.model("Shipper", ShipperSchema);
