require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./settings/DB/db");
const allRoutes = require("./router");
const protection = require("./settings/security/crossOrigin");
const path = require("path");
const uploadPath = path.join(__dirname, "./uploads");
const { setupSwagger } = require("./swagger");
const globalErrorHandler = require("./utils/globalError");

protection(app);

app.use(express.json());

dbConnection();

app.use("/api-docs", express.static(path.join(__dirname, "public")));

app.use(express.static(uploadPath));

setupSwagger(app);

app.use("/api", allRoutes);

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}'s port online...`);
});
