const mongoose = require("mongoose");
const connect = require("./dbConnector");
connect("connected to transaction database");

const investment_package_schema = mongoose.Schema({
  package_name: {
    type: String,
    required: true,
  },
  package_door: {
    type: String,
    required: true,
    enum: ["Public", "Closed"],
  },
  package_status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
  },
  payment_period: {
    type: String,
    required: true,
  },

  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
});
const Investment_package = mongoose.model(
  "investment_package",
  investment_package_schema,
);
module.exports = Investment_package;
