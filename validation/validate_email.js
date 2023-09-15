const Joi = require("joi");
const validate_email = (req) => {
  const schema = Joi.object({
    email: Joi.string().required().max(1000),
  });
  const result = schema.validate({
    email: req.email,
  });
  if (result.error) return result.error.message;
  return true;
};
module.exports = validate_email;
