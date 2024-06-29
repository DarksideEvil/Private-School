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
} = require("../validations/user");

const verifyToken = require("../utils/verifyToken");
const permission = require("../utils/permission");

/**
 * @swagger
 * /api/users/login:
 *  post:
 *    summary: Returns generated token for access to the system
 *    requestBody:
 *      required: true
 *      content:
 *        aplication/json:
 *          schema:
 *            type: object
 *            properties:
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Success for access
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                token:
 *                  type: string
 *      400:
 *        description: Bad Request, expected proper credentials from user
 *      401:
 *        description: The client lacks proper authentication credentials or has provided invalid credentials
 *      500:
 *        description: The server encountered an unexpected condition that prevented it from fulfilling the request
 */

router.route("/login").post(validateLogin, login);

router.use(verifyToken);

/**
 * @swagger
 * /api/users/register:
 *  post:
 *    summary: Returns new created user
 *    requestBody:
 *      required: true
 *      content:
 *        aplication/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *              role:
 *                type: string
 *    responses:
 *      201:
 *        description: New user created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/User'
 *      403:
 *        description: Access to the requested resource is forbidden
 *      500:
 *        description: The server encountered an unexpected condition that prevented it from fulfilling the request
 */

router
  .route("/register")
  .post(permission("user", ["write"]), validateRegister, register);

router.route("/").get(permission("user", ["read"]), getAll);

router.route("/:id").get(permission("user", ["read"]), validateParams, getOne);

router
  .route("/:id")
  .patch(permission("user", ["update"]), validateParams, editOne);

router
  .route("/:id")
  .delete(permission("user", ["delete"]), validateParams, deleteOne);

module.exports = router;
