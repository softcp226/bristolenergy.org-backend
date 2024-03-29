const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const verifyToken = require("../token/verifyToken");
const validate_create_investment = require("../validation/validate-create-investment");
const create_investment = require("../shape-model/create-investment");
const check_wallet_balance = require("../api_func/check_wallet_balance");
const {
  create_mail_options,
  transporter,
} = require("../mailer/investment_email");

Router.post("/", verifyToken, async (req, res) => {
  // console.log(req.body);
  try {
    const request_isvalid = validate_create_investment(req.body);
    if (request_isvalid != true)
      return res.status(400).json({ error: true, errMessage: request_isvalid });

    const user = await User.findById(req.body.user);
    if (!user)
      return res.status(404).json({
        error: true,
        errMessage: "invalid request, please login to create an investment",
      });

    if (parseInt(req.body.investment_amount) > user.final_balance)
      return res.status(400).json({
        error: true,
        errMessage:
          "Insufficient fund, please deposit more fund to your wallet to create an investment",
      });

    const wallet_balance = check_wallet_balance({
      user,
      incominMessage: req.body,
    });

    if (wallet_balance.error)
      return res
        .status(400)
        .json({ error: true, errMessage: wallet_balance.errMessage });


    user.set({
      active_investment:
        parseInt(user.active_investment) + parseInt(req.body.investment_amount),
      final_balance: user.final_balance - parseInt(req.body.investment_amount),
      last_deposit_method: req.body.payment_method,
    });
    await user.save();
    // console.log(user);
    const create_investment_result = await create_investment(req, res);

    if (create_investment_result.error) {
      //  console.log("return error in the overall page")
      return res.status(400).json({
        error: true,
        errMessage: create_investment_result.errMessage,
      });
    }
    transporter.sendMail(
      create_mail_options({
        // first_name: user.first_name,
        // last_name: user.last_name,
        full_name: user.full_name,
        reciever: user.email,
      }),
      (err, info) => {
        if (err) return err.message;
        //  console.log(info);
        // return res.status(400).json({
        //   error: true,
        //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
        // });
      },
    );

    res.status(200).json({
      error: false,
      message: "success!, you just created an investment",
    });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
