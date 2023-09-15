const Joi = require("joi");
const validate_admin_edit_payment_proccessing = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    name: Joi.string().required(),
    icon: Joi.string().required(),
    status: Joi.string().required(),
    wallet_address: Joi.string().required(),
    // wallet_note: Joi.string().required(),
  });
  const result = schema.validate({
    admin: req.admin,
    name:req.name,
    icon: req.icon,
    status:req.status,
    wallet_address: req.wallet_address,
    // wallet_note: req.wallet_note,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_admin_edit_payment_proccessing;
