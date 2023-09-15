const mongoose = require("mongoose");
const connect = require("./dbConnector");
connect("connected to deposit_request database");
require("./user");
require("../model/transaction");
require("./deposit_request");
const expiring_deposit_Schema = mongoose.Schema({
  deposit_request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deposit_request",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Expiring_deposit = mongoose.model(
  "expiring_deposit",
  expiring_deposit_Schema,
);
module.exports = Expiring_deposit;
