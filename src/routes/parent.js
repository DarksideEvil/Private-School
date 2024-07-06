const router = require("express").Router();
const { parentAccess, pupilReports } = require("../controllers/parent");
const {
  validateParams,
  validateParentAccess,
} = require("../validations/parent");

const verifyToken = require("../utils/verifyToken");
const permission = require("../utils/permission");

router.route("/login").post(validateParentAccess, parentAccess);

// router.use(verifyToken);

router.route("/pupilReports").post(
  // permission("user", ["write"]), validateRegister,
  pupilReports
);

module.exports = router;
