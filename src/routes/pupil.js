const router = require("express").Router();
const {
  register,
  getByGroup,
  getAll,
  getOne,
  editOne,
  deleteOne,
} = require("../controllers/pupil");
const { validateParams, validateRegister } = require("../validations/pupil");

const verifyToken = require("../utils/verifyToken");
const permission = require("../utils/permission");
const { upload } = require("../utils/upload");

router.use(verifyToken);

router
  .route("/register")
  .post(permission("pupil", ["write"]), upload, validateRegister, register);

router
  .route("/bygroup/:id")
  .get(permission("pupil", ["read"]), validateParams, getByGroup);

router.route("/").get(permission("pupil", ["read"]), getAll);

router.route("/:id").get(permission("pupil", ["read"]), validateParams, getOne);

router
  .route("/:id")
  .patch(permission("pupil", ["update"]), upload, validateParams, editOne);

router
  .route("/:id")
  .delete(permission("pupil", ["delete"]), validateParams, deleteOne);

module.exports = router;
