const Joi = require("joi");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).options({ allowUnknown: false });

const registerSchema = Joi.object({
  firstname: Joi.string().trim(true).required(),
  lastname: Joi.string().trim(true).required(),
  parent: Joi.object({
    fullname: Joi.string(),
    phone: Joi.string(),
  }),
  img: Joi.object(),
  phone: Joi.string().trim(true).required(),
  address: Joi.string().trim(true).required(),
  password: Joi.string().trim(true).required(),
  birthCertificate: Joi.string().trim(true),
  group: Joi.string().hex().length(24).trim(true),
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
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

async function validateRegister(req, res, next) {
  if (typeof req.body?.parent === "string" && req.body?.parent !== "") {
    req.body.parent = JSON.parse(req.body?.parent);
  }
  req.body.img = req.file;
  try {
    await registerSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

async function validateLogin(req, res, next) {
  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  validateParams,
  validateRegister,
  validateLogin,
};
