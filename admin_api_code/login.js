const express = require("express");
const Router = express.Router();
const genToken = require("../secure-admin-api/genToken");
const Admin = require("../model/admin");
const validate_admin = require("../validation/validate-login-admin");
const compare_passsword = require("../admin-hash/compare_password");
Router.post("/", async (req, res) => {
  const request_isvalid = validate_admin(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findOne({ user_name: req.body.user_name });
    if (!admin)
      return res.status(400).json({
        error: true,
        errMessage: "invalid user name or password (mail does not exist)",
      });
    const password_match = await compare_passsword(
      req.body.password,
      admin.password
    );
    if (!password_match)
      return res.status(400).json({
        error: true,
        errMessage: "invalid user name or password (pass err)",
      });
    const token = genToken(admin._id);
    res
      .status(200)
      .json({ error: false, message: { token, admin: admin._id } });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
