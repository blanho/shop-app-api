const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const Shipper = require("../models/Shipper");

const createShipper = async (req, res) => {
  const { shipperName, phone } = req.body;

  if (!shipperName || !phone) {
    throw new BadRequest("Please provide all values");
  }

  const shipper = await Shipper.create({ shipperName, phone });
  res.status(StatusCodes.CREATED).json({ shipper });
};

const getAllShippers = async (req, res) => {
  const shippers = await Shipper.find({});
  res.status(StatusCodes.OK).json({ count: shippers.length, shippers });
};

const getSingleShipper = async (req, res) => {
  const { id: shipperId } = req.params;

  const shipper = await Shipper.findOne({ _id: shipperId });

  if (!shipper) {
    throw new NotFound(`Not item can be found with id: ${shipperId}`);
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
    throw new NotFound(`Not item can be found with id: ${shipperId}`);
  }

  res.status(StatusCodes.OK).json({ shipper });
};

const deleteShipper = async (req, res) => {
  const { id: shipperId } = req.params;

  const shipper = await Shipper.findOne({ _id: shipperId });

  if (!shipper) {
    throw new NotFound(`Not item can be found with id: ${shipperId}`);
  }

  await shipper.remove();

  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

module.exports = {
  createShipper,
  getAllShippers,
  getSingleShipper,
  updateShipper,
  deleteShipper,
};
