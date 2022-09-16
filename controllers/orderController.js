const { BadRequest, NotFound } = require("../errors");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Shipper = require("../models/Shipper");
const { StatusCodes } = require("http-status-codes");
const checkUserAuthorization = require("../utils/checkAuthorization");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "randomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { cartItems, tax, shippingFee, shipper } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequest("No cart items provided");
  }
  if (!tax || !shippingFee || !shipper) {
    throw new BadRequest("Please provide tax and shipping fee and shipper");
  }
  const shipperInOrder = await Shipper.findOne({ _id: shipper });
  if (!shipperInOrder) {
    throw new NotFound(`No shipper with id: ${shipper}`);
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const product = await Product.findOne({ _id: item.product });
    if (!product) {
      throw new NotFound(`No product with id: ${item.product}`);
    }

    const { productName, price, image, _id } = product;

    // single order item
    const singleOrderItem = {
      amount: item.amount,
      productName,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];

    // calculate subtotal
    subtotal = subtotal + item.amount * price;
  }
  //  calculate total
  const total = subtotal + tax + shippingFee;

  //  get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    total,
    subtotal,
    tax,
    shippingFee,
    cartItems: orderItems,
    clientSecret: paymentIntent.client_secret,
    shipper,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).select("-user");
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFound(`No order can be found with id: ${orderId}`);
  }
  checkUserAuthorization(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.findOne({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFound(`No order can be found with id: ${orderId}`);
  }
  checkUserAuthorization(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
};
