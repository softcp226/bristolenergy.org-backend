const Joi = require("joi");

const validate_fetch_referral = (req) => {
  const schema = Joi.object({
    user: Joi.string().required().max(1000),
    // referral: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    user: req.user,
    // referral: req.referral,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_fetch_referral;
