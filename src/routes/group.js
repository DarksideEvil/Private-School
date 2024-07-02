const router = require("express").Router();
const {
  add,
  getAll,
  getOne,
  editOne,
  deleteOne,
} = require("../controllers/group");
const {
  validateParams,
  validateBody,
  validateUpdate,
} = require("../validations/group");

const verifyToken = require("../utils/verifyToken");
const permission = require("../utils/permission");

router.use(verifyToken);

router.route("/").post(permission("group", ["write"]), validateBody, add);

router.route("/").get(permission("group", ["read"]), getAll);

router.route("/:id").get(permission("group", ["read"]), validateParams, getOne);

router
  .route("/:id")
  .patch(
    permission("group", ["update"]),
    validateParams,
    validateUpdate,
    editOne
  );

router
  .route("/:id")
  .delete(permission("group", ["delete"]), validateParams, deleteOne);

module.exports = router;
