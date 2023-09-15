const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const Transaction = require("../model/transaction");
const verifyToken = require("../token/verifyToken");
const validate_fetch_transaction = require("../validation/validate_find_user");

Router.post("/", verifyToken, async (req, res) => {
 try {
   const request_isvalid = validate_fetch_transaction(req.body);
   if (request_isvalid != true)
     res.status(400).json({ error: true, errMessage: request_isvalid });

   const user = await User.findById(req.body.user);
   if (!user)
     return res.status(404).json({
       error: true,
       errMessage: "invalid request, please login to view your transactions",
     });
   const transactions = await Transaction.find({ user: req.body.user });
   if (transactions.length < 1)
     return res.status(404).json({
       error: true,
       errMessage: "sorry, you have not made any transaction at the moment",
     });
   res.status(200).json({
     error: false,
     message: transactions,
     user_balance: user.final_balance,
   });
 } catch (error) {
   res.status(400).json({ error: true, errMessage: error.message });
 }
});
module.exports = Router;
