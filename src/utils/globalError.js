const { errorLogger } = require("../utils/errorHandler");

function globalErrorHandler(err, req, res, next) {
  if (err) {
    errorLogger(req, err);
    return res.status(500).json({
      msg: `Internal Server Error: ${err?.message ? err?.message : err}`,
    });
  }

  next();
}

module.exports = globalErrorHandler;
