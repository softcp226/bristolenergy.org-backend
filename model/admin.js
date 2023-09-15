const connectDB = require("./dbConnector");
const mongoose = require("mongoose");
connectDB("connected to admin database");

const adminSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    maxlength: 1000,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  admin_area_charset: String,
  show_google_translator: String,
});

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
