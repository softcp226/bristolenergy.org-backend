const Joi = require("joi");

const validate_deposit_request = (req) => {
  const schema = Joi.object({
    user: Joi.string().required().max(1000),
    deposit_amount: Joi.number().required().min(0),
    payment_method: Joi.string().required(),
    investment_plan:Joi.string().required(),
    // currency: Joi.string().required(),
  });

  const result = schema.validate({
    user: req.user,
    deposit_amount: req.deposit_amount,
    payment_method: req.payment_method,
   investment_plan:req.investment_plan
    // currency: req.currency,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_deposit_request;
