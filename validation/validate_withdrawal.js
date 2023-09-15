const Joi = require("joi");
const validate_admin_fetchuser = (req) => {
  const schema = Joi.object({
    user: Joi.string().required().max(1000),
    withdrawal_amount: Joi.number().required().min(0),
    withdrawal_method: Joi.string().required().max(1000),
    wallet: Joi.string().required(),
  });
  const result = schema.validate({
    user: req.user,
    withdrawal_amount: req.withdrawal_amount,
    withdrawal_method: req.withdrawal_method,
    wallet: req.wallet,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_fetchuser;
