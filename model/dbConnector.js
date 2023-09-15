require("dotenv").config();

// const config = require("config");
const mongoose = require("mongoose");
const connectDB = (message) => {
//  const db_link = "mongodb://localhost:27017/ethexenergy";
   const db_link = process.env.db_Url;
  // console.log(db_link);
  // const db_link = config.get("db_Url");
  mongoose
    .connect(db_link)
    .then(() => console.log(message))
    .catch((err) => console.log(err.message));
};
module.exports = connectDB;
