const express = require("express");
const Router = express.Router();
const validate_user = require("../validation/validate_find_user");
const User = require("../model/user");
const verifyToken = require("../token/verifyToken");
Router.post("/", verifyToken, async (req, res) => {
 try {
   const req_isvalid = validate_user(req.body);
   if (req_isvalid != true)
     return res.status(400).json({ error: true, errMessage: req_isvalid });

   const user = await User.findById(req.body.user).select("-Password");
   if (!user)
     return res.status(403).json({
       error: true,
       errMessage: "invalid request, please login again to access this api",
     });
   res.status(200).json({ error: false, message: user });
 } catch (error) {
   res.status(400).json({ error: true, errMessage: error.message });
 }
});

module.exports = Router;
