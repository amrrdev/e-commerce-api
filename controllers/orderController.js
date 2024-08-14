import Product from "./../models/ProductModel.js";
import Order from "../models/OrderModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

import StatusCode from "http-status-codes";

const fakeStripeAPI = async ({ amount, currecny }) => {
  const clientSecret = "some random value";
  return { clientSecret, amount };
};

export const createOrder = catchAsync(async (req, res, next) => {
  const { items, tax, shippingFee } = req.body;

  if (!items || items.length < 1) {
    return next(
      new AppError("No cart items provided!", StatusCode.BAD_REQUEST)
    );
  }

  if (!tax || !shippingFee) {
    return next(new AppError("Please provide tax and shipping fee"));
  }

  let orderItmes = [];
  let subTotal = 0;
  /**
   * req.body
   * tax, shippingFee, items [
   *  {
   *    productID, amount
   * }
   * ]
   */
  for (const item of items) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct) {
      return next(
        new AppError("No product with this ID", StatusCode.NOT_FOUND)
      );
    }
    const { name, price, image, _id } = dbProduct;
    console.log(image);
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItmes = [...orderItmes, singleOrderItem];
    console.log(orderItmes);
    subTotal += item.amount * price;
  }
  const total = subTotal + tax + shippingFee;

  // Get Client Secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currecny: "usd",
  });

  const order = await Order.create({
    items: orderItmes,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user._id,
  });

  res.status(StatusCode.CREATED).json({
    status: "success",
    data: { order, clientSecret: order.clientSecret },
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(StatusCode.OK).json({
    status: "success",
    length: orders.length,
    data: { orders },
  });
});

export const getSingleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new AppError("There's no order what this ID", StatusCode.NOT_FOUND)
    );
  }

  res.status(StatusCode.OK).json({
    status: "success",
    data: { order },
  });
});

// accessabel for the user
export const getCurrentUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders || !orders.length) {
    return next(
      new AppError("There's no order for this user", StatusCode.NOT_FOUND)
    );
  }

  res.status(StatusCode.OK).json({
    status: "success",
    length: orders.length,
    data: { orders },
  });
});

export const updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new AppError("There's no order what this ID", StatusCode.NOT_FOUND)
    );
  }
  order.paymentId = req.body.paymentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCode.OK).json({
    status: "success",
    data: { order },
  });
});
