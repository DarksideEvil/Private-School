const { verify } = require("jsonwebtoken");
const { errorLogger } = require("../utils/errorHandler");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      const msg = `No token provided !`;
      errorLogger(req, msg, 403);
      return res.status(403).json({ msg });
    }

    const decoded = verify(token.split(" ")[1], process.env.JWT_SECRET);

    if (!decoded) {
      const msg = `Failed to authenticate token !`;
      errorLogger(req, msg, 403);
      return res.status(403).json({ msg });
    }

    req.user = decoded;
    next();
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
};

module.exports = verifyToken;
