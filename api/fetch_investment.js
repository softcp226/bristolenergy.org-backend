const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const Investment = require("../model/investment");
const verifyToken = require("../token/verifyToken");
const validate_user = require("../validation/validate_find_user");
const check_inv_expiration = require("../api_func/check_invest_exp");
Router.post("/", verifyToken, async (req, res) => {
 try {
   const request_isvalid = validate_user(req.body);
   if (request_isvalid != true)
     res.status(400).json({ error: true, errMessage: request_isvalid });

   const user = await User.findById(req.body.user);
   if (!user)
     return res.status(404).json({
       error: true,
       errMessage: "invalid request, please login to view your investments",
     });

   const check_inv_exp_result = await check_inv_expiration(req);
   console.log(await check_inv_exp_result);

   const investments = await Investment.find({ user: req.body.user });
   if (investments.length < 1)
     return res.status(404).json({
       error: true,
       errMessage: "sorry,you dont have any active investment at the moment",
     });

   res.status(200).json({ error: false, message: investments });
 } catch (error) {
   res.status(400).json({ error: true, errMessage: error.message });
 }
});
module.exports = Router;
