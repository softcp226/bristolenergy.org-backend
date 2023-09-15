const Joi = require("joi");
const validate_admin_user_status_update = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    users: Joi.array().required(),
    status: Joi.string().required(),
  });
  const result = schema.validate({
    admin: req.admin,
    users: req.users,
    status: req.status,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_user_status_update;
