const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest, Unauthorized } = require("../errors");
const Shipper = require("../models/Shipper");
const Order = require("../models/Order");

const createShipper = async (req, res) => {
  const shipper = await Shipper.create({ shipperName, phone });
  res.status(StatusCodes.CREATED).json({ shipper });
};

const getAllShippers = async (req, res) => {
  const shippers = await Shipper.find({});
  res.status(StatusCodes.OK).json({ count: shippers.length, shippers });
};

const getSingleShipper = async (req, res) => {
  const { id: shipperId } = req.params;

  const shipper = await Shipper.findOne({ _id: shipperId }).populate({
    path: "orders",
  });

  if (!shipper) {
    throw new NotFound(`Not shipper can be found with id: ${shipperId}`);
  }

  res.status(StatusCodes.OK).json({ shipper });
};

const updateShipper = async (req, res) => {
  const { id: shipperId } = req.params;

  const shipper = await Shipper.findOneAndUpdate(
    { _id: shipperId },
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!shipper) {
    throw new NotFound(`Not shipper can be found with id: ${shipperId}`);
  }

  res.status(StatusCodes.OK).json({ shipper });
};

const deleteShipper = async (req, res) => {
  const { id: shipperId } = req.params;

  const shipper = await Shipper.findOne({ _id: shipperId });

  if (!shipper) {
    throw new NotFound(`Not shipper can be found with id: ${shipperId}`);
  }

  const shipperInOrders = await Order.findOne({ shipper: shipperId });
  if (shipperInOrders) {
    throw new Unauthorized("Cannot delete this shipper");
  }

  await shipper.remove();

  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

const getSingleShipperOrders = async (req, res) => {
  const { id: shipperId } = req.params;
  const orders = await Order.find({ shipper: shipperId });
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

module.exports = {
  createShipper,
  getAllShippers,
  getSingleShipper,
  updateShipper,
  deleteShipper,
  getSingleShipperOrders,
};
