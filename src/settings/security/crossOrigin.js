const cors = require("cors");

const allowedOrigins = [];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET, HEAD, OPTIONS, POST, PUT, PATCH, DELETE",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

module.exports = (app) => {
  app.use(cors(corsOptions));
};
