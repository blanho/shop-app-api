const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
    minLength: 2,
  },
  contactName: {
    type: String,
    required: true,
    minLength: 2,
  },
  address: {
    type: String,
    minLength: 3,
  },
  city: {
    type: String,
    minLength: 2,
  },
  phone: {
    type: String,
    minLength: 10,
  },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
