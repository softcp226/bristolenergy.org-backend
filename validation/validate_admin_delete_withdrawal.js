const Joi = require("joi");
const validate_admin_approve_withdrawal = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    withdrawal_request: Joi.array().required().max(1000),
    // withdrawal_amount: Joi.number().required(),
  });
  const result = schema.validate({
    admin: req.admin,
    withdrawal_request: req.withdrawal_request,
    // withdrawal_amount: req.withdrawal_amount,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_approve_withdrawal;
