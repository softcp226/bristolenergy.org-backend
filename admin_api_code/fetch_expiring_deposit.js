const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Expiring_deposit = require("../model/expiring_deposit");
const validate_admin = require("../validation/validate-admin-dashboard");
const Admin = require("../model/admin");

Router.post("/fetch", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    const expiring_deposit = await Expiring_deposit.find().populate([
      "deposit_request",
      "user",
    ]);
    if (expiring_deposit.length < 1)
      return res
        .status(400)
        .json({ error: true, errMessage: "No expiring deposit at the moment" });

    
    res.status(200).json({ error: false, message:expiring_deposit });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;
