export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    // create a .stack property on the error object,
    // which provides a string representation
    // of the point in the code at which the Error was instantiated.
    Error.captureStackTrace(this, this.constructor);
  }
}
