const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const Investment = require("../model/investment");
const verifyToken = require("../secure-admin-api/verifyToken");
const validate_admin_cancel_investment = require("../validation/validate_admin_cancel_investment");
const Admin = require("../model/admin");

Router.post("/", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_cancel_investment(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    let investment = await Investment.findById(req.body.investment);
    console.log(investment);
    let user = await User.findById(investment.user);
    if (!user) {
      if (!investment)
        return res.status(400).json({
          error: true,
          errMessage:
            "the investment you requested to cancel no longer exist please refresh and try again",
        });

      await Investment.findByIdAndDelete(req.body.investment);
      return res.status(200).json({
        error: false,
        message: "you successfully cancelled an investment",
      });
    }

    if (!investment)
      return res.status(400).json({
        error: true,
        errMessage:
          "the investment you requested to cancel no longer exist please refresh and try again",
      });

    user.set({
      final_balance:
        user.final_balance +
        parseInt(investment.amount) +
        parseInt(investment.profit) -
        investment.loss,
      active_investment: user.active_investment - investment.amount,
    });
    await user.save();
    await Investment.findByIdAndDelete(req.body.investment);

    res
      .status(200)
      .json({ error: false, message: "success, you canceled an investment" });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
