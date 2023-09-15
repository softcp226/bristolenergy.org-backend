const Joi = require("joi");
const validate_fund_user = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    user: Joi.string().required().max(1000),
    deposit_amount: Joi.number().required().min(0),
    profit_loss: Joi.number().required(),
    active_investment: Joi.number().required().min(0),
    referral_bonus: Joi.number().required().min(0),
  });
  const result = schema.validate({
    admin: req.admin,
    user: req.user,
    deposit_amount: req.deposit_amount,
    profit_loss: req.profit_loss,
    active_investment: req.active_investment,
    referral_bonus: req.referral_bonus,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_fund_user;
