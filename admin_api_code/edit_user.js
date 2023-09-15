const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const validate_admin_edit_user = require("../validation/validate_admin_edit_user");
const validate_admin_update_user = require("../validation/validate_admin_user_status_update");
const Admin = require("../model/admin");
const User = require("../model/user");
const hashPassword = require("../hash/hashPassword");

Router.post("/", verifyToken, async (req, res) => {
  console.log(req.body);
  const request_isvalid = validate_admin_edit_user(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });
    const user = await User.findById(req.body.user);
    if (!user)
      return res.status(400).json({
        error: true,
        errMessage: "The user you requested to edit was not found",
      });
    const password = req.body.password
      ? await hashPassword(req.body.password)
      : user.password;

    await user.set({
      full_name: req.body.full_name || user.full_name,
      username: req.body.user_name || user.username,
      email: req.body.email || user.email,
      //  country:req.body.country||user.country,
      password,
      status: req.body.user_status || user.status,
      demo_account: req.body.demo_account || user.demo_account,
    });

    await user.save();
    console.log(user);
    res
      .status(200)
      .json({ error: false, message: "user updated successfully" });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.post("/update/user/status", verifyToken, async (req, res) => {
 console.log(req.body)
  const request_isvalid = validate_admin_update_user(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    req.body.users.forEach(async (userID) => {
      let user = await User.findById(userID);
      if (!user) return console.log("user not found");
      user.set({ status: req.body.status });
      await user.save();
    });
    res.status(200).json({ error: false, message: "success" });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
