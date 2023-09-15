const Joi = require("joi");
const validat_fetchOne_payment_proccessing = (req) => {
  const schema = Joi.object({
    admin: Joi.string().required().max(1000),
    proccessing_id: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    admin: req.admin,
    proccessing_id: req.proccessing_id,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validat_fetchOne_payment_proccessing;
