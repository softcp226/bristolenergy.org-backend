const Joi = require("joi");

const validate_admin_fetch_top_referral = (req) => {
  const schema = Joi.object({
    admin:Joi.string().required(),
  });

  const result = schema.validate({
    admin:req.admin,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_fetch_top_referral;
