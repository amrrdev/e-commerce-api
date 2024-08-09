import AppError from "../utils/appError.js";

import StatusCode from "http-status-codes";

export default (req, res, next) => {
  next(
    new AppError(`Can't find ${req.url} on the server!`, StatusCode.NOT_FOUND)
  );
};
