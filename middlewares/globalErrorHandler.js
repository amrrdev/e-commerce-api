export default (err, req, res, next) => {
    err.statusCode ||= 500;
    err.status ||= "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
};
