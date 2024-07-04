const Joi = require("joi");
const { errorLogger } = require("../utils/errorHandler");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).options({ allowUnknown: false });

const registerSchema = Joi.object({
  username: Joi.string().trim(true).required(),
  phone: Joi.string().trim(true).required(),
  password: Joi.string().trim(true).required(),
  role: Joi.string(),
}).options({ allowUnknown: false });

const updateSchema = Joi.object({
  username: Joi.string().trim(true),
  phone: Joi.string().trim(true),
  password: Joi.string().trim(true),
  role: Joi.string(),
}).options({ allowUnknown: false });

const loginSchema = Joi.object({
  phone: Joi.string().trim(true).required(),
  password: Joi.string().trim(true).required(),
}).options({ allowUnknown: false });

async function validateParams(req, res, next) {
  try {
    await paramsSchema.validateAsync(req.params);
    next();
  } catch (err) {
    errorLogger(req, err, 400);
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

async function validateRegister(req, res, next) {
  try {
    await registerSchema.validateAsync(req.body);
    next();
  } catch (err) {
    errorLogger(req, err, 400);
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

async function validateLogin(req, res, next) {
  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    errorLogger(req, err, 400);
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

async function validateUpdate(req, res, next) {
  try {
    await updateSchema.validateAsync(req.body);
    next();
  } catch (err) {
    errorLogger(req, err, 400);
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  validateParams,
  validateRegister,
  validateLogin,
  validateUpdate,
};
