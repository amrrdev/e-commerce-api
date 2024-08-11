import User from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as JWT from "./../utils/jwtUtils.js";

import StatusCode from "http-status-codes";

const filterObject = (reqBody, ...allowedFields) => {
  const newObject = {};
  Object.keys(reqBody).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = reqBody[el];
  });
  return newObject;
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  res.status(StatusCode.OK).json({
    status: "success",
    data: { users },
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new AppError("There's no user with this ID", StatusCode.NOT_FOUND)
    );
  res.status(StatusCode.OK).json({
    status: "success",
    data: { user },
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  if (req.body.oldPassword || req.body.newPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateUserPassword",
        StatusCode.BAD_REQUEST
      )
    );
  }
  const filterBodyObject = filterObject(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    filterBodyObject,
    {
      new: true,
      runValidators: true,
    }
  );

  JWT.attachCookiesToResponse(res, JWT.createJWTPayload(updatedUser));

  res.status(StatusCode.OK).json({
    status: "success",
    data: { user: updatedUser },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {});

export const updateUserPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;
  if (!oldPassword || !newPassword || !newPasswordConfirm) {
    return next(
      new AppError(
        "Missing fields, Please provide old password,  new password and new password confirm",
        StatusCode.BAD_REQUEST
      )
    );
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError("Passwords do not match", StatusCode.BAD_REQUEST));
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePasswords(oldPassword, user.password))) {
    return next(new AppError("Invalid Credentials", StatusCode.UNAUTHORIZED));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  JWT.attachCookiesToResponse(res, JWT.createJWTPayload(user));

  res.status(StatusCode.OK).json({
    status: "success",
    message: "password updated successfully",
  });
});

export const showCurrectUser = catchAsync(async (req, res, next) => {
  console.log(req.user);
  res.status(StatusCode.OK).json({
    status: "success",
    data: { user: req.user },
  });
});
