const jwt = require("jsonwebtoken");

const genToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.secretKey);
  return token;
};

module.exports = genToken;
