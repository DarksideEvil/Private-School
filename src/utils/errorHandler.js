const { createLogger, format, transports } = require("winston");
const { join } = require("path");
const moment = require("moment");

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: new transports.File({
    filename: join(__dirname, "../logs/info.log"),
    level: "info",
  }),
});

const logger1 = createLogger({
  level: "error",
  format: format.json(),
  transports: [
    new transports.File({
      filename: join(__dirname, "../logs/err.log"),
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger1.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

function infoLogger(request) {
  const preparedInfo = {
    application: request.headers["user-agent"],
    user: {
      _id: request?.user?._id,
      name: request?.user?.username,
    },
    requestParams: request.body,
    requestBody: request.body,
    referer: request.headers?.referer,
    method: request.method,
    requestedApi: request.originalUrl,
    date: moment().format("YYYY-MM-DD HH:mm"),
  };
  logger.info(preparedInfo);
}

function errorLogger(request, error, errStatusCode) {
  const preparedError = {
    application: request.headers["user-agent"],
    user: {
      _id: request?.user?._id,
      name: request?.user?.username,
    },
    requestParams: request.params,
    requestBody: request.body,
    referer: request.headers?.referer,
    method: request.method,
    requestedApi: request.originalUrl,
    error: error?.message ? error?.message : error,
    errStatusCode: errStatusCode ? errStatusCode : 500,
    date: moment().format("YYYY-MM-DD HH:mm"),
  };
  logger1.error(preparedError);
}

function globalErrorHandler(err, req, res, next) {
  if (err) {
    errorLogger(req, err);
    return res.status(500).json({
      msg: `Internal Server Error: ${err?.message ? err?.message : err}`,
    });
  }

  next();
}

module.exports = {
  infoLogger,
  errorLogger,
  globalErrorHandler,
};
