const mongoose = require("mongoose");
const connect = require("./dbConnector");
connect("connected to deposit_request database");
require("./user");
require("../model/transaction");
const deposit_request_Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  deposit_amount: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_wallet:{
     type: String,
    required: true,
  },
  investment_plan:{
    type: String,
    required: true,
  },
  // currency: {
  //   type: String,
  //   required: true,
  // },
  date: {
    type: String,
    required: true,
  },
  scheduled_expiring_date: {
    type: String,
    required: true,
  },
  expiring_date: {
    type: String,
    required: true,
  },
  expiring_date_string: {
    type: String,
    required: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: true,
  },
  proof: String,

  is_approved: {
    type: Boolean,
    required: true,
    default: false,
  },
  expiring_deposit: {
    type: Boolean,
    required: true,
    default: false,
  },
  added_to_problem: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  transaction_hash: String,
});

const Deposit_request = mongoose.model(
  "deposit_request",
  deposit_request_Schema,
);
module.exports = Deposit_request;
