const Joi = require("joi");
const validate_admin_cancel_investment = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    investment: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    admin: req.admin,
    investment: req.investment,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_cancel_investment;
