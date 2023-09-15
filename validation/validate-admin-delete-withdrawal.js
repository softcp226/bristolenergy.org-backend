const Joi = require("joi");
const validate_admin_fetchuser = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    withdrawal_request: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    admin: req.admin,
    withdrawal_request: req.withdrawal_request,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_fetchuser;
