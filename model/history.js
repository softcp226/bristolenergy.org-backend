const mongoose = require("mongoose");
const connect = require("./dbConnector");
connect("connected to transaction database");
require("./user");
require("./deposit_request");
require("./withdrawal_request");
const { datetime } = require("../shape-model/system-variables");

const historySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description_head: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },

  referral: {
    type: Boolean,
  },
  deposit_request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deposit_request",
  },
  withdrawal_request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "withdrawal_request",
  },
  date: {
    type: String,
    required: true,
    default: datetime,
  },
});

const History = mongoose.model("history", historySchema);
module.exports = history;
