const Joi = require("joi");
const validate_admin_delete_investment_package = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    package_id: Joi.string().required().max(1000),
    
  });
  const result = schema.validate({
    admin: req.admin,
    package_id: req.package_id,
    
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_delete_investment_package;
