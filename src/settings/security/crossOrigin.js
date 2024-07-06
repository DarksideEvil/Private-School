const cors = require("cors");
const rateLimit = require("express-rate-limit");

const allowedOrigins = [];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET, HEAD, OPTIONS, POST, PUT, PATCH, DELETE",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

const limiter = rateLimit({
  windowMs: 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      msg: 'Too many requests, please try again later.',
    });
  },
});

module.exports = (app) => {
  app.use(cors(corsOptions));
  app.use(limiter);
};
