const Joi = require("joi");

const validate_user = (req) => {
  const schema = Joi.object({
    full_name: Joi.string().required().max(1000),
    username: Joi.string().required().max(1000),
    Email: Joi.string().email().min(0).required(),
    // country: Joi.string().required(),
    password: Joi.string().required().min(8).max(1000),
    referral: Joi.string()
  });
  const result = schema.validate({
    full_name: req.full_name,
    username: req.username,
    Email: req.email,
    password: req.password,
    referral:req.referral
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_user;
