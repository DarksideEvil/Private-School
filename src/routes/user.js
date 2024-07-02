const router = require("express").Router();
const {
  register,
  login,
  getAll,
  getOne,
  editOne,
  deleteOne,
} = require("../controllers/user");
const {
  validateParams,
  validateRegister,
  validateLogin,
  validateUpdate,
} = require("../validations/user");

const verifyToken = require("../utils/verifyToken");
const permission = require("../utils/permission");

router.route("/login").post(validateLogin, login);

router.use(verifyToken);

router
  .route("/register")
  .post(permission("user", ["write"]), validateRegister, register);

router.route("/").get(permission("user", ["read"]), getAll);

router.route("/:id").get(permission("user", ["read"]), validateParams, getOne);

router
  .route("/:id")
  .patch(
    permission("user", ["update"]),
    validateParams,
    validateUpdate,
    editOne
  );

router
  .route("/:id")
  .delete(permission("user", ["delete"]), validateParams, deleteOne);

module.exports = router;
