import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "./../models/UserModel.js";
import * as JWT from "./../utils/jwtUtils.js";

import StatusCode from "http-status-codes";

export const register = catchAsync(async (req, res, next) => {
  // first register user is an admin
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role,
  });

  const payload = { name: user.name, userId: user._id, role: user.role };

  JWT.attachCookiesToResponse(res, payload);

  res.status(StatusCode.CREATED).json({
    status: "success",
    data: { user },
  });
});

export const login = catchAsync(async (req, res, next) => {});
export const logout = catchAsync(async (req, res, next) => {});
export const getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(StatusCode.OK).json({ users });
};
