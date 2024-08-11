import User from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as JWT from "./../utils/jwtUtils.js";

import StatusCode from "http-status-codes";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token)
    return next(
      new AppError(
        "Your are not logged in! Please log in to get access",
        StatusCode.UNAUTHORIZED
      )
    );

  const decoded = await JWT.verifyJWTToken(token);
  const user = await User.findById(decoded.userId);

  if (!user)
    return next(new AppError("User no longer exists", StatusCode.UNAUTHORIZED));
  req.user = user;

  next();
});

export const authorizePermission = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    next();
  });
};
