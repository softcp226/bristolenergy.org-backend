const Joi = require("joi");
const validate_admin_dashboard = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    skip_count:Joi.number().required(),
    display_count:Joi.number().required()
  });
  const result = schema.validate({
    admin: req.admin,
    skip_count: req.skip_count,
    display_count: req.display_count,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_dashboard;
