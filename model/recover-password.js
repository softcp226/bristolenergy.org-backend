const connectDB = require("./dbConnector");
const mongoose = require("mongoose");
const user = require("./user");
connectDB("connected to recover password db");

const recover_passwordSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  reset_token: {
    type: String,
    required: true,
  },
});

const Recover_password = mongoose.model(
  "recover_password",
  recover_passwordSchema
);
module.exports = Recover_password;
