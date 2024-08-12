import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, "rating must be above 1.0"],
      max: [5, "rating must be below 5.0"],
      required: [true, "A review must have a rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide a review title"],
      maxLength: [100, "A title must have less than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please provide a review text"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Create a unique compound index on user and product fields.
// This ensures that each user can only create one review per product.
// If a user tries to submit another review for the same product,
// MongoDB will enforce this constraint and return an error.
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
