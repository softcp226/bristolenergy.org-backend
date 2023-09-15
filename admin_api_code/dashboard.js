const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Users = require("../model/user");
const Admin = require("../model/admin");
const Investment_packages = require("../model/investment-package");
const Withdrawal_request = require("../model/withdrawal_request");
const Deposit_request = require("../model/deposit_request");

const validate_admin_dashboard = require("../validation/validate-admin-dashboard");

const calculate_percentage = (total_number, part_number) => {
  const percentage = (part_number / total_number) * 100;
  return percentage;
};

Router.post("/", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_dashboard(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });
    const users = await Users.find();
    const suspended_users = await Users.find({ status:"suspended" });
    const disabled_users = await Users.find({ status:"disabled" });
    const active_users = await Users.find({status:"active"});
    const users_ever_madedeposit = await Users.find({
      made_first_deposit: true,
    });
     const users_that_never_madedeposit = await Users.find({
      made_first_deposit: false,
    });
    console.log(users_that_never_madedeposit);
    const investment_packages = await Investment_packages.find();
    const withdrawal_request = await Withdrawal_request.find().populate("user");
    const pending_deposit = await Deposit_request.find({
      added_to_problem:false}).populate("user");

    // if (users.length < 1)
    //   return res
    //     .status(400)
    //     .json({ error: true, errMessage: "No registerd user at the moment" });
    res.status(200).json({
      error: false,
      message: {
        users,
        user_length: users.length,
        suspended_users: {
          length: suspended_users.length,
          percentage: `${Math.round(
            calculate_percentage(users.length, suspended_users.length),
          )}%`,
        },
        disabled_users: {
          length: disabled_users.length,
          percentage: `${Math.round(
            calculate_percentage(users.length, disabled_users.length),
          )}%`,
        },
        active_users: {
          length: active_users.length,
          percentage: `${Math.round(
            calculate_percentage(users.length, active_users.length),
          )}%`,
        },
        users_ever_madedeposit: {
          length: users_ever_madedeposit.length,
          percentage: `${Math.round(
            calculate_percentage(users.length, users_ever_madedeposit.length),
          )}%`,
        },
        users_that_never_madedeposit: {
          length: users_that_never_madedeposit.length,
          percentage: `${Math.round(
            calculate_percentage(
              users.length,
              users_that_never_madedeposit.length,
            ),
          )}%`,
        },
        investment_packages: {
          length: investment_packages.length,
        },
        withdrawal_request: {
          length: withdrawal_request.length,
        },
        pending_deposit: {
          length: pending_deposit.length,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
