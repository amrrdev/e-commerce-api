import fs from "node:fs/promises";

import AppError from "../utils/appError.js";
import Product from "./../models/ProductModel.js";
import User from "./../models/UserModel.js";

import catchAsync from "./../utils/catchAsync.js";
import StatusCode from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create({ ...req.body, user: req.user._id });

  res.status(StatusCode.CREATED).json({
    status: "success",
    data: { product: newProduct },
  });
});

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().populate(
    "user",
    "name email role",
    User
  );

  res.status(StatusCode.OK).json({
    status: "success",
    length: products.length,
    data: { products },
  });
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(
      new AppError("There's no product with that ID", StatusCode.NOT_FOUND)
    );

  res.status(StatusCode.OK).json({
    status: "success",
    data: { product },
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  console.log("updateProduct middleware");

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    return next(
      new AppError("There's no product with that ID", StatusCode.NOT_FOUND)
    );
  }

  res.status(StatusCode.OK).json({
    status: "success",
    data: { product: updatedProduct },
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return next(
      new AppError("There's no product with that ID", StatusCode.NOT_FOUND)
    );
  }

  res.status(StatusCode.OK).json({
    status: "success",
    message: "deleted successfully",
  });
});

export const uploadImage = catchAsync(async (req, res, next) => {
  console.log("uploadImage middleware");
  if (!req.files || !req.files.image) {
    return next(new AppError("No Image Uploaded!", StatusCode.BAD_REQUEST));
  }

  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  const imageFile = req.files.image;
  console.log(imageFile.size);

  if (!validTypes.includes(imageFile.mimetype)) {
    return next(
      new AppError(
        "Invalid file type. Only images are allowed.",
        StatusCode.BAD_REQUEST
      )
    );
  }
  // maximam 5MB
  if (imageFile.size > 1024 * 1024 * 5) {
    return next(
      new AppError(
        "Please upload image smaller than 5MB.",
        StatusCode.BAD_REQUEST
      )
    );
  }
  const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
    use_filename: true,
    folder: "e-commerce images",
  });

  await fs.unlink(imageFile.tempFilePath);

  // if (req.params.id) {
  //   req.body.image = result.secure_url;
  //   return next();
  // }

  res.status(StatusCode.OK).json({
    status: "success",
    image: { src: result.secure_url },
  });
});

export const amr = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  res.send("amr");
});
