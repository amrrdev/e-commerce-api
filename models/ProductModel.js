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
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
