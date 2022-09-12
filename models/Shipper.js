const mongoose = require("mongoose");

const ShipperSchema = new mongoose.Schema({
  shipperName: {
    type: String,
    minLength: 2,
  },
  phone: {
    type: String,
    minLength: 10,
  },
});

module.exports = mongoose.model("Shipper", ShipperSchema);
