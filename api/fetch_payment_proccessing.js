const express = require("express");
const Router = express.Router();
const verifyToken = require("../token/verifyToken");
const Payment_proccessing = require("../model/proccessings");
const validate_user_fetch_payment_proccessing = require("../validation/validate_user_fetch_payment_proccessing");
const User = require("../model/user");

Router.post("/", verifyToken, async (req, res) => {
 try {
  const request_isvalid = validate_user_fetch_payment_proccessing(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  
    const user = await User.findById(req.body.user);
    if (!user)
      return res.status(404).json({
        error: true,
        errMessage: "invalid request, please login to view your investments",
      });

    const payment_proccessing = await Payment_proccessing.find();
    if (payment_proccessing.length < 1)
      return res.status(400).json({
        error: true,
        errMessage: "No payment procccessor has been created",
      });

    res.status(200).json({ error: false, message: payment_proccessing });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;
