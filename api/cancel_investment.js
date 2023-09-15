const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const Investment = require("../model/investment");
const verifyToken = require("../token/verifyToken");
const validate_cancel_investment = require("../validation/validate_cancel_investment");

Router.post("/", verifyToken, async (req, res) => {
   try {
     const request_isvalid = validate_cancel_investment(req.body);
     if (request_isvalid != true)
       return res
         .status(400)
         .json({ error: true, errMessage: request_isvalid });

     let investment = await Investment.findById(req.body.investment);
     let user = await User.findById(req.body.user);
     if (!user)
       return res.status(400).json({
         error: true,
         errMessage: "please login again to cancel an investment",
       });
     if (!investment)
       return res.status(400).json({
         error: true,
         errMessage:
           "the investment you requested to cancel no longer exist please refresh and try again",
       });

     user.set({
       final_balance: user.final_balance + parseInt(investment.amount),
       // parseInt(investment.profit) -
       // investment.loss,
       active_investment: user.active_investment - investment.amount,
     });
    
Promise.all([ await user.save(),
     await Investment.findByIdAndDelete(req.body.investment)])
     res
       .status(200)
       .json({ error: false, message: "success, you canceled an investment" });
   } catch (error) {
     res.status(400).json({ error: true, errMessage: error.message });
   }
});
module.exports = Router;
