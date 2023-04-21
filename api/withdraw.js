const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const verifyToken = require("../token/verifyToken");
const validate_withdrawal = require("../validation/validate_withdrawal");
const Withdrawal_request = require("../model/withdrawal_request");
const { create_mail_options, transporter } = require("../mailer/withdrawal");
const create_withdrawal_transaction = require("../shape-model/create-withdrawal-transaction");
const { datetime } = require("../shape-model/system-variables");
const check_withdrawal_method = require("../api_func/check_withdrawal_method");
Router.post("/", verifyToken, async (req, res) => {
  try {
    const request_isvalid = validate_withdrawal(req.body);
    if (request_isvalid != true)
      return res.status(400).json({ error: true, errMessage: request_isvalid });

    const user = await User.findById(req.body.user);
    if (!user)
      return res.status(404).json({
        error: true,
        errMessage: "invalid request, please login again to make a withdrawal",
      });

    if (parseInt(req.body.withdrawal_amount) < 10)
      return res.status(400).json({
        error: true,
        errMessage: "Withdrawal amount can't be lesser than $10",
      });

    if (parseInt(req.body.withdrawal_amount) > user.final_balance)
      return res.status(400).json({
        error: true,
        errMessage:
          "Insufficient fund, please deposit more fund or cancel investment if  it exist to be able to withdraw fund",
      });
    //  console.log(user.made_first_deposit);
    // if (user.made_first_deposit != true)
    //   return res.status(400).json({
    //     error: true,
    //     errMessage:
    //       "To make a withdrawal of your money or registration bonus , you need to atleast make a first deposit",
    //   });
    const deductbalance_from_method = await check_withdrawal_method(
      user,
      parseInt(req.body.withdrawal_amount),
      req.body.withdrawal_method,
    );
    if (deductbalance_from_method.error)
      return res.status(400).json({
        error: true,
        errMessage: deductbalance_from_method.errMessage,
      });
    user.set({
      final_balance: user.final_balance - parseInt(req.body.withdrawal_amount),
    });
    // let currentdate = new Date();
    // let datetime = `${currentdate.getFullYear()}-${
    //   currentdate.getMonth() + 1
    // }-${currentdate.getDate()} -  ${currentdate.getHours()}: ${currentdate.getMinutes()} : ${currentdate.getSeconds()}`;
    create_withdrawal_transaction(req);
    await user.save();
    // await withdrawal_request.save();
    transporter.sendMail(
      create_mail_options({
        // first_name: user.first_name,
        // last_name: user.last_name,
        full_name: user.full_name,
        reciever: user.email,
        amount: req.body.withdrawal_amount,
        withdrawal_method: req.body.withdrawal_method,
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
      message: "you successfully initiated a withdrawal",
    });
  } catch (error) {
    //  console.log(error);
    res.status(200).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;
