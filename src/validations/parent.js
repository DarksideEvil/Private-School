const Joi = require("joi");
const { errorLogger } = require("../utils/errorHandler");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).options({ allowUnknown: false });

const parentVerifySchema = Joi.object({
  phone: Joi.string().trim(true).required(),
}).options({ allowUnknown: false });

const parentAccessSchema = Joi.object({
  verificationCode: Joi.string().trim(true).required(),
}).options({ allowUnknown: false });

const pupilReportObtainSchema = Joi.object({
  startDate: Joi.string().trim(true).required(),
  endDate: Joi.string().trim(true).required(),
  pupil: Joi.string().hex().length(24),
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

async function validateParentVerify(req, res, next) {
  try {
    await parentVerifySchema.validateAsync(req.body);
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

async function validateObtainPupilReport(req, res, next) {
  try {
    await pupilReportObtainSchema.validateAsync(req.query);
    next();
  } catch (err) {
    errorLogger(req, err, 400);
    return res.status(400).send({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  validateParams,
  validateParentVerify,
  validateParentAccess,
  validateObtainPupilReport,
};
