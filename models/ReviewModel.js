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

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findByIdAndUpdate(productId, {
      averageRating: result[0]?.averageRating || 0,
      numberOfReviews: result[0]?.numberOfReviews || 0,
    });
  } catch (error) {
    console.log(error);
  }
};

// for new documents Model.create()
ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

// findByIdAndDelete will trigger this middleware
ReviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) await doc.constructor.calculateAverageRating(doc.product);
});

// findByIdAndDelete will trigger this middleware
ReviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await doc.constructor.calculateAverageRating(doc.product);
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
