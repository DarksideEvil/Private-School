const Joi = require("joi");
const { errorLogger } = require("../utils/errorHandler");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).options({ allowUnknown: false });

const parentAccessSchema = Joi.object({
  phone: Joi.string().trim(true).required(),
  verificationCode: Joi.string().trim(true).required(),
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

async function validateParentAccess(req, res, next) {
  try {
    await parentAccessSchema.validateAsync(req.body);
    next();
  } catch (err) {
    errorLogger(req, err, 400);
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  validateParams,
  validateParentAccess,
};
