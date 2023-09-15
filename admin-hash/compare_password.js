const bcrypt = require("bcrypt");

const compare_password = async (password, encrypted_password) => {
  const password_match = await bcrypt.compare(password, encrypted_password);
  return password_match;
};

module.exports = compare_password;
