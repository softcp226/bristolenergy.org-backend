const mongoose = require("mongoose");
const connect = require("./dbConnector");
connect("connected to payment proccessing database");
const payment_proccessing_Schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
  },
  wallet_address: {
    type: String,
    required: true,
  },
  wallet_note: String,
  // deposit_enabled: {
  //   type: Boolean,
  //   required: true,
  //   default: true,
  // },
  // withdrawal_enabled: {
  //   type: Boolean,
  //   required: true,
  //   default: true,
  // },
  total_system_earnings: String,
  total_funds_added: Number,
  total_users_balance: Number,
  total_referral_commision: Number,
  total_withdrawals: Number,
  pending_withdrawals: Number,
});
const payment_proccessing = mongoose.model(
  "payment_proccessing",
  payment_proccessing_Schema,
);
module.exports = payment_proccessing;
