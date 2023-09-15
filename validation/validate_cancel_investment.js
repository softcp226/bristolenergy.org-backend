const Joi = require("joi");
const validate_cancel_investment = (req) => {
  const schema = Joi.object({
    user: Joi.string().required().max(1000),
    investment: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    user: req.user,
    investment: req.investment,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_cancel_investment;
