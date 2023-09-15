const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const verifyToken = require("../token/verifyToken");
const validate_find_user = require("../validation/validate_find_user");
const check_inv_expiration = require("../api_func/check_invest_exp");

Router.post("/", verifyToken, async (req, res) => {
  // console.log(req.body)
 try {
   const request_isvalid = validate_find_user(req.body);
   if (request_isvalid != true)
     return res.status(400).json({ error: true, errMessage: request_isvalid });
   const user = await User.findById(req.body.user);

   if (!user)
     return res.status(400).json({
       error: true,
       errMessage:
         "an unexpected error occured please login again to access this api",
     });

   await check_inv_expiration(req);
   // console.log(await check_inv_exp_result);

   res.status(200).json({ error: false, message: user });
 } catch (error) {
  res.status(400).json({error:true,errMessage:error.message})
 }
});
module.exports = Router;
