import AppError from "../utils/appError.js";
import Review from "./../models/ReviewModel.js";

import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requried: [true, "A product must have a name"],
      minLength: [3, "A product name must have at least 3 characters"],
      maxLength: [100, "A product name must have less than 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      requried: [true, "A product must have a description"],
      minLength: [10, "A product description have at least 10 characters"],
      maxLength: [
        1000,
        "A product description must have less than 100 characters",
      ],
    },
    price: {
      type: Number,
      requried: [true, "A product must have a price"],
      default: 0,
    },
    image: {
      type: [String],
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide product gategory"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: `{VALUE} is not supported!ds`,
      },
    },
    color: {
      type: [String],
      required: [true, "Please provide product color"],
      default: ["#222"],
    },
    featured: {
      type: Boolean,
      default: true,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// When you call .populate("reviews") on a product document,
// Mongoose performs the following actions:

// 1) Mongoose accesses the Review collection, which contains all reviews.

// 2) It looks for the `product` field in each review document,
//    which acts as the foreignField that references a Book.

// 3) Mongoose finds all review documents where the `product` field
//    matches the `_id` of the current Book document (localField).

// 4) It retrieves these matching reviews and attaches them
//    as an array to the `reviews` virtual field of the Book document.

// Define a virtual field for reviews
ProductSchema.virtual("reviews", {
  ref: "Review", // The model to use
  localField: "_id", // The field in the Product model
  foreignField: "product", // The field in the Review model
  justOne: false, // Indicating a one-to-many relationship
});

// delete all reviews related to this product
ProductSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await this.model("Review").deleteMany({ product: this._id });
    next();
  } catch (err) {
    next(
      new AppError("Error While removing the reviews related to this product")
    );
  }
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
