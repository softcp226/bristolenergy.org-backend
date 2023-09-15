const mongoose = require("mongoose");
const connect = require("./dbConnector");
connect("connected to transaction database");
require("./user");
require("./deposit_request");
require("./withdrawal_request");
const transaction_Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  deposit_request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deposit_request",
  },

  withdrawal_request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "withdrawal_request",
  },

  refrence_number: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: String,
    required: true,
    // default: Date.now(),
  },
  coded_date: String,
  debit: String,
  credit: String,
  transaction_hash: String,
  status: {
    type: String,
    required: true,
    enum: ["pending", "success", "failed"],
  },
});

const Transaction = mongoose.model("transaction", transaction_Schema);
module.exports = Transaction;
