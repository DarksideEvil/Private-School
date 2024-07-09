const router = require("express").Router();
const {
  parentAccess,
  parentVerification,
  pupilReports,
} = require("../controllers/parent");
const {
  // validateParams,
  validateParentVerify,
  validateParentAccess,
  validateObtainPupilReport,
} = require("../validations/parent");

const verifyToken = require("../utils/verifyToken");
const permission = require("../utils/permission");

router.route("/login").post(validateParentVerify, parentVerification);

router.route("/verify").post(validateParentAccess, parentAccess);

router.use(verifyToken);

router
  .route("/pupilReports")
  .get(permission("parent", ["read"]), validateObtainPupilReport, pupilReports);

module.exports = router;
