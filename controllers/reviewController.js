import catchAsync from "../utils/catchAsync.js";
import StatusCode from "http-status-codes";
import Review from "./../models/ReviewModel.js";
import User from "./../models/UserModel.js";
import Product from "./../models/ProductModel.js";
import AppError from "../utils/appError.js";

export const createReview = catchAsync(async (req, res, next) => {
  const isValidProduct = await Product.findById(req.body.product);

  if (!isValidProduct) {
    return next(
      new AppError("There's no product with this ID", StatusCode.NOT_FOUND)
    );
  }

  const alreadySubmitted = await Review.findOne({
    user: req.user._id,
    product: isValidProduct._id,
  });

  if (alreadySubmitted) {
    return next(
      new AppError(
        "Already submitted review for this product",
        StatusCode.BAD_REQUEST
      )
    );
  }

  const review = await Review.create({
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    user: req.user._id,
    product: req.body.product,
  });

  res.status(StatusCode.CREATED).json({
    status: "success",
    data: { review },
  });
});

export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({}).populate({
    path: "user",
    select: "name",
    model: User,
  });

  res.status(StatusCode.OK).json({
    status: "success",
    length: reviews.length,
    data: { reviews },
  });
});

export const getSingleReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new AppError("There's no review with this id", StatusCode.NOT_FOUND)
    );
  }
  res.status(StatusCode.OK).json({
    status: "success",
    data: {
      review,
    },
  });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const { title, rating, comment } = req.body;
  const review = await Review.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    { title, rating, comment },
    { new: true, runValidators: true }
  );
  if (!review) {
    return next(
      new AppError("There's no review with this ID", StatusCode.NOT_FOUND)
    );
  }
  res.status(StatusCode.OK).json({
    status: "success",
    data: { review },
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  let review;
  if (req.user.role === "admin") {
    review = await Review.findByIdAndDelete(req.params.id);
  } else {
    review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
  }
  if (!review) {
    return next(
      new AppError("There's no review with this ID", StatusCode.NOT_FOUND)
    );
  }

  res.status(StatusCode.OK).json({
    status: "success",
    message: "Deleted successfully",
  });
});
