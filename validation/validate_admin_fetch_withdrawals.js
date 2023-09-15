const Joi = require("joi");
const validate_admin_dashboard = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    display_count: Joi.number().min(0).required(),
    skip_count: Joi.number().min(0).required(),
  });
  const result = schema.validate({
    admin: req.admin,
    display_count: req.display_count,
    skip_count: req.skip_count,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_dashboard;
