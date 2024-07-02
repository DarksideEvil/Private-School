const router = require("express").Router();
const {
  checkOut,
  todayAttendance,
  groupCheckout,
  getAll,
  getOne,
  editOne,
  deleteOne,
} = require("../controllers/checkout");
const { validateParams, validateUpdate } = require("../validations/checkout");

const verifyToken = require("../utils/verifyToken");
const permission = require("../utils/permission");

router.use(verifyToken);

router
  .route("/checkout/:id")
  .post(permission("checkout", ["write"]), validateParams, checkOut);

router
  .route("/todayattendance")
  .get(permission("checkout", ["read"]), todayAttendance);

router
  .route("/groupattendances")
  .get(permission("checkout", ["read"]), groupCheckout);

router.route("/").get(permission("checkout", ["read"]), getAll);

router
  .route("/:id")
  .get(permission("checkout", ["read"]), validateParams, getOne);

router
  .route("/:id")
  .patch(
    permission("checkout", ["update"]),
    validateParams,
    validateUpdate,
    editOne
  );

router
  .route("/:id")
  .delete(permission("checkout", ["delete"]), validateParams, deleteOne);

module.exports = router;
