const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const validate_admin_setting = require("../validation/validate_admin_setting");
const Admin = require("../model/admin");
const hashPassword = require("../hash/hashPassword");
Router.post("/", verifyToken, async (req, res) => {
  console.log(req.body);
  const request_isvalid = validate_admin_setting(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });
    const password = await hashPassword(req.body.password);
    admin.set({
      user_name: req.body.username || admin.user_name,
      password: password || admin.password,
      email: req.body.email || admin.email,
      admin_area_charset:
        req.body.admin_area_charset || admin.admin_area_charset,
      show_google_translator:
        req.body.show_google_translator || admin.show_google_translator,
    });
    admin.save();
    res.status(200).json({ error: false, message: admin });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
