const Joi = require("joi");
const validate_admin_fetch_deposit = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    deposit_request: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    admin: req.admin,
    deposit_request: req.deposit_request,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_fetch_deposit;
