const router = require("express").Router();
const userRoute = require("./routes/user");
const pupilRoute = require("./routes/pupil");
const groupRoute = require("./routes/group");
const checkoutRoute = require("./routes/checkout");
const parentRoute = require("./routes/parent");

router.use("/users", userRoute);

router.use("/pupils", pupilRoute);

router.use("/groups", groupRoute);

router.use("/checkouts", checkoutRoute);

router.use("/parents", parentRoute);

module.exports = router;
