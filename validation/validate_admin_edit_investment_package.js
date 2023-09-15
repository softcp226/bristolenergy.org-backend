const Joi = require("joi");
const validate_admin_edit_investment_package = (req) => {
  
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    package_id: Joi.string().max(1000).required(),
    package_name: Joi.string().required(),
    package_door: Joi.string().required(),
    package_status: Joi.string().required(),
    payment_period: Joi.string().required(),
    min: Joi.string().required(),
    max: Joi.string().required(),
    percentage: Joi.string().required(),
  });
  const result = schema.validate({
    admin: req.admin,
    package_id: req.package_id,
    package_name: req.package_name,
    package_door: req.package_door,
    package_status: req.package_status,
    payment_period: req.payment_period,
    min: req.min,
    max: req.max,
    percentage: req.percentage,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_edit_investment_package;
