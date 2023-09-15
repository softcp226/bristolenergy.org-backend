const Joi = require("joi");
const validate_admin_edit_user = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    user: Joi.string().required().max(1000),
    full_name: Joi.string(),
    user_status: Joi.string(),
    user_name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().allow(""),
    demo_account:Joi.boolean(),
  });
  const result = schema.validate({
    admin: req.admin,
    user: req.user,
    full_name: req.full_name,
    user_status: req.user_status,
    user_name: req.user_name,
    email: req.email,
    password: req.password,
    demo_account: req.demo_account,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_edit_user;
