const Joi = require("joi");
const validate_admin_deleteuser = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    users: Joi.array().required(),
  });
  const result = schema.validate({
    admin: req.admin,
    users: req.users,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_deleteuser;
