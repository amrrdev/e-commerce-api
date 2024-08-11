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

  // const payload = { name: user.name, userId: user._id, role: user.role };

  JWT.attachCookiesToResponse(res, JWT.createJWTPayload(user));

  res.status(StatusCode.CREATED).json({
    status: "success",
    data: { user },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new AppError("Missing email or password!", StatusCode.BAD_REQUEST)
    );

  const user = await User.findOne({ email }).select("+password -__v");
  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(
      new AppError("Invalid Email or Password!", StatusCode.UNAUTHORIZED)
    );
  }

  // const payload = { name: user.name, userId: user._id, role: user.role };

  JWT.attachCookiesToResponse(res, JWT.createJWTPayload(user));

  user.password = undefined;

  res.status(StatusCode.OK).json({
    status: "success",
    data: { user },
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCode.OK).json({ message: "user logged out" });
});
