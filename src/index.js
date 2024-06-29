require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./settings/DB/db");
const allRoutes = require("./router");
const protection = require("./settings/security/crossOrigin");
const path = require("path");
const uploadPath = path.join(__dirname, "./uploads");
const swaggerConfigs = require("./swagger");

app.use(express.json());

dbConnection();

protection(app);

app.use(express.static(uploadPath));

swaggerConfigs(app);

app.use("/api", allRoutes);

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}'s port online...`);
});
