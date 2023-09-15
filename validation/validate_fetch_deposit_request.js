const Joi = require("joi");

const validate_fetch_deposit_request = (req) => {
  const schema = Joi.object({
    user: Joi.string().required().max(1000),
    deposit_request_id: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    user: req.user,
    deposit_request_id: req.deposit_request_id,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_fetch_deposit_request;
