import { StatusCodes } from "http-status-codes";

function handleValidationErrorDB(error) {
  error.message = Object.keys(error.errors)
    .map((key) => error.errors[key].message)
    .join(", ");

  error.statusCode = StatusCodes.BAD_REQUEST;

  return error;
}

function handleDuplicationErrorDB(error) {
  error.message = `Duplicate value entered for ${Object.keys(
    err.keyValue
  )} field, please choose another value`;

  error.statusCode = StatusCodes.BAD_REQUEST;

  return error;
}

export default (err, req, res, next) => {
  const error = { ...err };
  error.statusCode ||= StatusCodes.INTERNAL_SERVER_ERROR;
  error.status ||= "error";

  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  if (error.code && error.code === 11000)
    error = handleDuplicationErrorDB(error);

  if (process.env.NODE_ENV === "development")
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
    });
  else {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
};
