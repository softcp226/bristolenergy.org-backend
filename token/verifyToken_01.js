const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
console.log("key",process.env.token_key01);
  if (!req.body.token_01)
    return res.status(403).json({
      error: true,
      errMessage: "No token found please login to access this api ",
    });
  try {
    jwt.verify(req.body.token_01, process.env.token_key01);
    next();
  } catch (err) {
    res.status(400).json({
      error: true,
      errMessage: `${err.message} please login to access this api`,
    });
  }
};
module.exports = validateToken;

