const router = require("express").Router();
const userRoute = require("./routes/user");
const pupilRoute = require("./routes/pupil");
const groupRoute = require("./routes/group");
const checkoutRoute = require("./routes/checkout");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *       example:
 *         name: John Doe
 *         email: johndoe@example.com
 */

/**
 * @swagger
 * /users/register:
 *  post:
 *    summary: Returns new created user
 *    responses:
 *      201:
 *        description: New user created
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */

router.use("/users", userRoute);

router.use("/pupils", pupilRoute);

router.use("/groups", groupRoute);

router.use("/checkouts", checkoutRoute);

module.exports = router;
