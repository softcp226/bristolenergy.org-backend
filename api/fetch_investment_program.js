const express = require("express");
const Router = express.Router();
const Investment_package = require("../model/investment-package");

Router.post("/", async (req, res) => {
  try {
    const investment_package = await Investment_package.find();
    if (investment_package.length <= 0)
      return res.status(404).json({
        error: true,
        errMessage: "no investment packages has been created at the moment",
      });
    res.status(200).json({ error: false, message: investment_package });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
