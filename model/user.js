const mongoose = require("mongoose");
const connect = require("./dbConnector");
connect("connected to user database");
const { datetime } = require("../shape-model/system-variables");

const userSchema = mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // country: {
  //   type: String,
  //   required: true,
  // },

  password: {
    type: String,
    required: true,
  },
  final_balance: {
    type: Number,
    default: 0,
  },
  total_deposit: {
    type: Number,
    default: 0,
  },
  active_deposit: {
    type: Number,
    default: 0,
  },
  last_deposit: {
    type: Number,
    default: 0,
  },

  total_withdrawal: {
    type: Number,
    default: 0,
  },

  pending_withdrawal: {
    type: Number,
    default: 0,
  },
  profit_loss: {
    type: Number,
    default: 0,
  },
  active_investment: {
    type: Number,
    default: 0,
  },
  total_earning: {
    type: Number,
    required: true,
    default: 0,
  },
  total_penalty: {
    type: Number,
    required: true,
    default: 0,
  },
  referral_bonus: {
    type: Number,
    default: 0,
  },

  last_deposit_method: String,

  bitcoin_balance: {
    type: Number,
    default: 0,
  },
  ethereum_balance: {
    type: Number,
    default: 0,
  },
  usdt_balance: {
    type: Number,
    default: 0,
  },
  payer_balance: {
    type: Number,
    default: 0,
  },
  perfect_money_balance: {
    type: Number,
    default: 0,
  },
  bnb_balance: {
    type: Number,
    default: 0,
  },

  referral_link: String,
  made_first_deposit: {
    type: Boolean,
    required: true,
    default: false,
  },
  referral: String, //the user that referd this user
  registration_date: {
    type: String,
    required: true,
    default: datetime,
  },
  // is_suspended: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  // is_disabled: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  status: {
    type: String,
    enum: ["active", "suspended", "disabled"],
    default: "active",
  },
  auto_withdrawal: {
    type: Boolean,
    required: true,
    default: true,
  },
  auto_pay_earning: {
    type: Boolean,
    required: true,
    default: false,
  },
  demo_account: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
