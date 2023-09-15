const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Investment = require("../model/investment");
const Admin = require("../model/admin");
const validate_admin_fetchuser = require("../validation/validate-admin-dashboard");
Router.post("/", verifyToken, async (req, res) => {
 try {
   const request_isvalid = validate_admin_fetchuser(req.body);
   if (request_isvalid != true)
     return res.status(400).json({ error: true, errMessage: request_isvalid });

   const admin = await Admin.findById(req.body.admin);
   if (!admin)
     return res.status(403).json({
       error: true,
       errMessage: "Forbidden!, please login again to access this api",
     });
   const investments = await Investment.find().populate("user");
   if (investments.length < 1)
     return res.status(400).json({
       error: true,
       errMessage: "No one has made an investment at the moment",
     });
   res.status(200).json({ error: false, message: investments });
 } catch (error) {
   res.status(400).json({ error: true, errMessage: error.message });
 }
});
module.exports = Router;
