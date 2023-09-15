const Joi = require("joi");
const validate_admin_delete_proccessing = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    payment_proccessor_ID: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    admin: req.admin,
    payment_proccessor_ID: req.payment_proccessor_ID,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_delete_proccessing;
