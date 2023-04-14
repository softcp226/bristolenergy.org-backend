const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const User = require("../model/user");
const Admin = require("../model/admin");
const validate_request = require("../validation/validate_admin_delete_user");

Router.delete("/", verifyToken, async (req, res) => {
  const request_is_valid = validate_request(req.body);
  if (request_is_valid != true)
    return res.status(400).json({ error: true, errMessage: request_is_valid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });
    req.body.users.forEach(async (user) => {
      await User.findByIdAndDelete(user);
    });

    res.status(200).json({
      error: false,
      message: `${
        req.body.users.length > 1
          ? "you successfully deleted all the selected users"
          : "You successfully deleted one user"
      }`,
    });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;
