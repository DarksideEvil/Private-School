const Joi = require("joi");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).options({ allowUnknown: false });

const bodySchema = Joi.object({
  pupil: Joi.string().hex().length(24).trim(true).required(),
  checkIn: Joi.string().trim(true),
  checkOut: Joi.string().trim(true),
}).options({ allowUnknown: false });

const updateSchema = Joi.object({
  pupil: Joi.string().hex().length(24),
  checkIn: Joi.string(),
  checkOut: Joi.string(),
}).options({ allowUnknown: false });

async function validateParams(req, res, next) {
  try {
    await paramsSchema.validateAsync(req.params);
    next();
  } catch (err) {
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

async function validateUpdate(req, res, next) {
  try {
    await updateSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  validateParams,
  validateUpdate,
};
