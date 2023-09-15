const Joi = require("joi");
const validate_user_fetch_payment_proccessing = (req) => {
  const schema = Joi.object({
    user: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    user: req.user,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_user_fetch_payment_proccessing;
