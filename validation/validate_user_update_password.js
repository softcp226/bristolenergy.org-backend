const Joi = require("joi");

const validate_user_update = (req) => {
  const Schema = Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required(),
    new_password: Joi.string().required(),
  });
  const result = Schema.validate({
    user: req.user,
    password: req.password,
    new_password: req.new_password,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_user_update;
