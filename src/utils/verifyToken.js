const { verify } = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    const decoded = verify(token.split(" ")[1], process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({ msg: `Failed to authenticate token !` });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message ? err.message : err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
};

module.exports = verifyToken;
