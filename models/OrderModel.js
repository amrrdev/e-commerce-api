import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item must have a name"],
  },
  image: {
    type: [String],
    required: [true, "Item must have an image"],
  },
  price: {
    type: Number,
    required: [true, "Item must have a price"],
  },
  amount: {
    type: Number,
    required: [true, "Provide the amount of the item"],
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: [true, "Order Item must belong to a product!"],
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    items: {
      type: [CartItemSchema],
    },
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user!"],
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
