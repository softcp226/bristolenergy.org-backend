const Joi = require("joi");
const validate_admin_dashboard = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    username: Joi.string().allow(""),
    password: Joi.string().allow(""),
    email: Joi.string().allow(""),
    admin_area_charset: Joi.string().allow(""),
    show_google_translator: Joi.string().allow(""),
  });
  const result = schema.validate({
    admin: req.admin,
    username: req.username,
    password: req.password,
    email: req.email,
    admin_area_charset: req.admin_area_charset,
    show_google_translator: req.show_google_translator,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_dashboard;
