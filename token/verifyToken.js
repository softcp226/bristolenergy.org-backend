const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  if (!req.body.token)
    return res
      .status(403)
      .json({
        error: true,
        errMessage: "No token found please login to access this api ",
      });
  try {
    jwt.verify(req.body.token, process.env.secretKey);
    next();
  } catch (err) {
    res
      .status(400)
      .json({
        error: true,
        errMessage: `${err.message} please login to access this api`,
      });
  }
};
module.exports = validateToken;
