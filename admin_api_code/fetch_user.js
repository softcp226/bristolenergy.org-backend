const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Users = require("../model/user");
const Admin = require("../model/admin");
const validate_admin_fetchuser = require("../validation/validate_admin_fetch_user");
const validate_admin_fetch_singleuser = require("../validation/validate_admin_fetch_single_user");
Router.post("/", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_fetchuser(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });
    const users = await Users.find()
      // .skip(req.body.skip_count)
      // .limit(req.body.display_count);
    if (users.length < 1)
      return res
        .status(400)
        .json({ error: true, errMessage: "No registerd user at the moment" });
    res.status(200).json({ error: false, message: users });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.post("/single_user", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_fetch_singleuser(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });
    const user = await Users.findById(req.body.user);
    if (!user)
      return res
        .status(404)
        .json({ error: true, errMessage: "the requested user was not found." });
    res.status(200).json({ error: false, message: user });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
