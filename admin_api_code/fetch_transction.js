const express = require("express");
const Router = express.Router();
// const User = require("../model/user");
const Admin = require("../model/admin");

const Transaction = require("../model/transaction");
const verifyToken = require("../secure-admin-api/verifyToken");
const validate_admin_fetch_transaction = require("../validation/validate_admin_fetch_transactions");

Router.post("/", verifyToken, async (req, res) => {
  console.log(req.body);
  const request_isvalid = validate_admin_fetch_transaction(req.body);
  if (request_isvalid != true)
    res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(404).json({
        error: true,
        errMessage: "invalid request, please login to view transactions",
      });
    const transactions = await Transaction.find({ status: "success" }).populate(
      "user",
    );
    if (transactions.length < 1)
      return res.status(404).json({
        error: true,
        errMessage: "sorry, you have not made any transaction at the moment",
      });
    res.status(200).json({
      error: false,
      message: transactions,
    });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
