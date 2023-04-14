const express = require("express");
const Router = express.Router();
const User = require("../model/user");
// const Investment = require("../model/investment");
const verifyToken = require("../token/verifyToken");
const validate_fetch_referral = require("../validation/validate_fetch_referral");
Router.post("/", verifyToken, async (req, res) => {
 try {
   const request_isvalid = validate_fetch_referral(req.body);
   if (request_isvalid != true)
     res.status(400).json({ error: true, errMessage: request_isvalid });

   const user = await User.findById(req.body.user);
   if (!user)
     return res.status(404).json({
       error: true,
       errMessage: "invalid request, please login to view your referral",
     });

  //  console.log(user);
   const referral = await User.find({ referral: user.username });
  //  console.log(referral);
   if (referral.length <= 0)
     return res.status(400).json({
       error: true,
       errMessage: "No one has registerd with your referral link at the moment",
     });

   res.status(200).json({ error: false, message: referral });
 } catch (error) {
   res.status(400).json({ error: true, errMessage: error.message });
 }
});
module.exports = Router;
