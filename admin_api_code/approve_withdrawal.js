const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Withdrawal_request = require("../model/withdrawal_request");
const Transaction = require("../model/transaction");
const Admin = require("../model/admin");
const { coded_date } = require("../shape-model/system-variables");

// const validate_admin = require("../validation/validate-admin-fetchuser");
const validate_admin_approve_withdrawal = require("../validation/validate_admin_approve_withdrawal");
const validate_admin_delete_withdrawal = require("../validation/validate_admin_delete_withdrawal");
const validate_admin_approve_mass_withdrawal = require("../validation/validate_admin_approve_mass_withdrawal");
const User = require("../model/user");
const {
  create_mail_options,
  transporter,
} = require("../mailer/approve_withdrawal");

const {
  create_mail_options2,
  transporter2,
} = require("../mailer/delete_withdrawal");

Router.post("/", verifyToken, async (req, res) => {
  console.log("request sent here", req.body);
  const request_isvalid = validate_admin_approve_withdrawal(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    const withdrawal_request = await Withdrawal_request.findById(
      req.body.withdrawal_request,
    );
    if (!withdrawal_request)
      return res.status(400).json({
        error: true,
        errMessage: "the withdrawal you requested to approve was not found",
      });
    const transaction = await Transaction.findById(
      withdrawal_request.transaction,
    );
    if (!transaction)
      return res.status(400).json({
        error: true,
        errMessage:
          "the withdrawal you requested to approve is not associated with a transaction",
      });
    const user = await User.findById(withdrawal_request.user);

    if (!user)
      return res.status(400).json({
        error: true,
        errMessage:
          "the user that made the deposit you are trying to approve no longer exist",
      });

    // if (referral) {
    //   const mypercentage = (parseInt(req.body.deposit_amount) / 100) * 10;
    //   referral.set({
    //     final_balance:
    //       parseInt(referral.final_balance) + parseInt(mypercentage),
    //     referral_bonus:
    //       parseInt(referral.referral_bonus) + parseInt(mypercentage),
    //   });
    //   referral.save();
    //   transporter2.sendMail(
    //     create_mail_options2({
    //       first_name: referral.first_name,
    //       last_name: referral.last_name,
    //       reciever: referral.email,
    //       referral_amount: `$${mypercentage
    //         .toString()
    //         .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.0`,
    //     }),
    //     (err, info) => {
    //       if (err) return console.log(err.message);
    //       console.log(info);
    //       // return res.status(400).json({
    //       //   error: true,
    //       //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
    //       // });
    //     },
    //   );
    // }
    // let bonus = parseInt(req.body.deposit_amount) / 2;
    user.set({
      // final_balance:
      //   parseInt(user.final_balance) -
      //   parseInt(withdrawal_request.withdrawal_amount),

      total_withdrawal:
        parseInt(user.total_withdrawal) +
        parseInt(withdrawal_request.withdrawal_amount),

      //   made_first_deposit: true,
    });
    transaction.set({
      status: "success",
      coded_date,
      transaction_hash: req.body.withdrawal_hash,
    });

    // await Withdrawal_request.findByIdAndDelete(req.body.withdrawal_request);

    withdrawal_request.set({ is_approved: true });

    await transaction.save();
    await user.save();
    await withdrawal_request.save();

    transporter.sendMail(
      create_mail_options({
        // first_name: user.first_name,
        // last_name: user.last_name,
        full_name: user.full_name,
        reciever: user.email,
        withdrawal_amount: withdrawal_request.withdrawal_amount,
        withdrawal_hash: req.body.withdrawal_hash,
        wallet: withdrawal_request.wallet,
        withdrawal_method: withdrawal_request.withdrawal_method,
      }),
      (err, info) => {
        if (err) return console.log(err.message);
        console.log(info);
        // return res.status(400).json({
        //   error: true,
        //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
        // });
      },
    );
    res.status(200).json({
      error: false,
      message: "success, you approved a withdrawal request",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.post("/mass_payment", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_approve_mass_withdrawal(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    req.body.withdrawal_request.forEach(async (withdrawal_requestID) => {
      const withdrawal_request = await Withdrawal_request.findById(
        withdrawal_requestID,
      );
      if (!withdrawal_request)
        return console.log(
          "the withdrawal you requested to approve was not found",
        );
      // return res.status(400).json({
      //   error: true,
      //   errMessage: "the withdrawal you requested to approve was not found",
      // });

      const transaction = await Transaction.findById(
        withdrawal_request.transaction,
      );
      if (!transaction)
        return console.log(
          "the withdrawal you requested to approve is not associated with a transaction",
        );
      // return res.status(400).json({
      //   error: true,
      //   errMessage:
      //     "the withdrawal you requested to approve is not associated with a transaction",
      // });
      const user = await User.findById(withdrawal_request.user);

      if (!user)
        return console.log(
          "the user that made the deposit you are trying to approve no longer exist",
        );
      // return res.status(400).json({
      //   error: true,
      //   errMessage:
      //     "the user that made the deposit you are trying to approve no longer exist",
      // });

      user.set({
        // final_balance:
        //   parseInt(user.final_balance) -
        //   parseInt(withdrawal_request.withdrawal_amount),

        total_withdrawal:
          parseInt(user.total_withdrawal) +
          parseInt(withdrawal_request.withdrawal_amount),

        //   made_first_deposit: true,
      });
      transaction.set({ status: "success" });
      await Withdrawal_request.findByIdAndDelete(withdrawal_requestID);
      await transaction.save();
      await user.save();

      transporter.sendMail(
        create_mail_options({
          // first_name: user.first_name,
          // last_name: user.last_name,
          full_name: user.full_name,
          reciever: user.email,
          withdrawal_amount: withdrawal_request.withdrawal_amount,
        }),
        (err, info) => {
          if (err) return console.log(err.message);
          console.log(info);
          // return res.status(400).json({
          //   error: true,
          //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
          // });
        },
      );
    });

    res.status(200).json({
      error: false,
      message: "success, you approved the selected ithdrawal request",
    });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.delete("/delete", async (req, res) => {
  console.log("request to delete sent", req.body);
  const request_isvalid = validate_admin_delete_withdrawal(req.body);
  console.log(request_isvalid);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    req.body.withdrawal_request.forEach(async (withdrawal_requestID) => {
      const withdrawal_request = await Withdrawal_request.findById(
        withdrawal_requestID,
      );
      console.log("withdrawal request", withdrawal_request);
      if (!withdrawal_request)
        return console.log(
          "the withdrawal you requested to delete does not exist.",
        );

      const transaction = await Transaction.findById(
        withdrawal_request.transaction,
      );
      if (!transaction)
        return console.log(
          "the withdrawal you requested to remove is not associted with a transaction",
        );
      // return res.status(400).json({
      //   error: true,
      //   errMessage:
      //     "the withdrawal you requested to approve is not associated with a transaction",
      // });
      transaction.set({ status: "failed" });

      await transaction.save();
      const user = await User.findById(withdrawal_request.user);

      if (!user)
        return console.log(
          "the user you deleted it's withdrawal request no longer exist",
        );

      user.set({
        final_balance:
          parseInt(user.final_balance) +
          parseInt(withdrawal_request.withdrawal_amount),

        // total_withdrawal:
        //   parseInt(user.total_withdrawal) +
        //   parseInt(withdrawal_request.withdrawal_amount),

        //   made_first_deposit: true,
      });
      await user.save();
      await Withdrawal_request.findByIdAndDelete(withdrawal_requestID);

      transporter2.sendMail(
        create_mail_options2({
          // first_name: user.first_name,
          // last_name: user.last_name,
          full_name: user.full_name,
          reciever: user.email,
          withdrawal_amount: withdrawal_request.withdrawal_amount,
        }),
        (err, info) => {
          if (err) return console.log(err.message);
          console.log(info);
          // return res.status(400).json({
          //   error: true,
          //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
          // });
        },
      );
    });

    res.status(200).json({
      error: false,
      message: "success, you removed a withdrawal request",
    });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;
