const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Deposit_request = require("../model/deposit_request");
const Transaction = require("../model/transaction");
const Admin = require("../model/admin");
const { coded_date } = require("../shape-model/system-variables");

// const validate_admin = require("../validation/validate-admin-fetchuser");
const validate_admin_approve_deposit = require("../validation/validate_admin_approve_deposit");
const User = require("../model/user");
const {
  create_mail_options,
  transporter,
} = require("../mailer/approve_deposit");

const {
  create_mail_options2,
  transporter2,
} = require("../mailer/referral_fund");

Router.post("/", verifyToken, async (req, res) => {
  console.log(req.body);
  const request_isvalid = validate_admin_approve_deposit(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    const deposit_request = await Deposit_request.findById(
      req.body.deposit_request,
    );
    if (!deposit_request)
      return res.status(400).json({
        error: true,
        errMessage: "the deposit you requested to approve was not found",
      });
    const transaction = await Transaction.findById(deposit_request.transaction);
    if (!transaction)
      return res.status(400).json({
        error: true,
        errMessage:
          "the deposit you requested to approve is not associated with a transaction",
      });
    const user = await User.findById(deposit_request.user);

    if (!user)
      return res.status(400).json({
        error: true,
        errMessage:
          "the user that made the deposit you are trying to approve no longer exist",
      });

    const referral = await User.findOne({username:user.referral});
    if (referral) {
      const mypercentage = (parseInt(req.body.deposit_amount) / 100) * 5;
      referral.set({
        final_balance:
          parseInt(referral.final_balance) + parseInt(mypercentage),
        referral_bonus:
          parseInt(referral.referral_bonus) + parseInt(mypercentage),
      });
      referral.save();
      transporter2.sendMail(
        create_mail_options2({
          // first_name: referral.first_name,
          // last_name: referral.last_name,
          full_name: referral.full_name,
          reciever: referral.email,
          referral_amount: `$${mypercentage
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.0`,
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
    }
    // let bonus = parseInt(req.body.deposit_amount) / 2;
    user.set({
      final_balance:
        parseInt(user.final_balance) + parseInt(req.body.deposit_amount),
      made_first_deposit: true,
      last_deposit: parseInt(req.body.deposit_amount),
    });
    transaction.set({ status: "success", coded_date });

    // await Deposit_request.findByIdAndDelete(req.body.deposit_request);
    deposit_request.set({ status: "success" });
    await deposit_request.save();
    await transaction.save();
    await user.save();

    transporter.sendMail(
      create_mail_options({
        // first_name: user.first_name,
        // last_name: user.last_name,
        full_name: user.full_name,
        reciever: user.email,
        deposit_amount:req.body.deposit_amount
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
      message: "success, you approved a deposit request",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;

// const express = require("express");
// const Router = express.Router();
// const verifyToken = require("../secure-admin-api/verifyToken");
// const Deposit_request = require("../model/deposit_request");
// const Total_deposit = require("../model/total_deposit");
// const Transaction = require("../model/transaction");
// const Admin = require("../model/admin");

// // const validate_admin = require("../validation/validate-admin-fetchuser");
// const validate_admin_approve_deposit = require("../validation/validate_admin_approve_deposit");
// const User = require("../model/user");
// const {
//   create_mail_options,
//   transporter,
// } = require("../mailer/approve_deposit");

// const {
//   create_mail_options2,
//   transporter2,
// } = require("../mailer/referral_fund");

// Router.post("/", verifyToken, async (req, res) => {
//   console.log(req.body);
//   const request_isvalid = validate_admin_approve_deposit(req.body);
//   if (request_isvalid != true)
//     return res.status(400).json({ error: true, errMessage: request_isvalid });
//   try {
//     const admin = await Admin.findById(req.body.admin);
//     if (!admin)
//       return res.status(403).json({
//         error: true,
//         errMessage: "Forbidden!, please login again to access this api",
//       });

//     const deposit_request = await Deposit_request.findById(
//       req.body.deposit_request,
//     );
//     if (!deposit_request)
//       return res.status(400).json({
//         error: true,
//         errMessage: "the deposit you requested to approve was not found",
//       });
//     const transaction = await Transaction.findById(deposit_request.transaction);
//     if (!transaction)
//       return res.status(400).json({
//         error: true,
//         errMessage:
//           "the deposit you requested to approve is not associated with a transaction",
//       });
//     console.log(deposit_request.user);
//     const user = await User.findById(deposit_request.user);

//     if (!user)
//       return res.status(400).json({
//         error: true,
//         errMessage:
//           "the user that made the deposit you are trying to approve no longer exist",
//       });

//     if (user.made_first_deposit != true) {
//       // Requiring ObjectId from mongoose npm package
//       const ObjectId = require("mongoose").Types.ObjectId;

//       // Validator function
//       function isValidObjectId(id) {
//         if (ObjectId.isValid(id)) {
//           if (String(new ObjectId(id)) === id) return true;
//           return false;
//         }
//         return false;
//       }
//       if (isValidObjectId(user.referral)) {
//         const referral = await User.findById(user.referral);
//         if (referral) {
//           const mypercentage = (parseInt(req.body.deposit_amount) / 100) * 10;
//           referral.set({
//             final_balance:
//               parseInt(referral.final_balance) + parseInt(mypercentage),
//             referral_bonus:
//               parseInt(referral.referral_bonus) + parseInt(mypercentage),
//           });
//           referral.save();
//           transporter2.sendMail(
//             create_mail_options2({
//               first_name: referral.first_name,
//               last_name: referral.last_name,
//               reciever: referral.email,
//               referral_amount: `$${mypercentage
//                 .toString()
//                 .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.0`,
//             }),
//             (err, info) => {
//               if (err) return console.log(err.message);
//               console.log(info);
//               // return res.status(400).json({
//               //   error: true,
//               //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
//               // });
//             },
//           );
//         } else {
//           console.log("not a valid objectID");
//         }

//         //end   //
//       }
//     }
//     // let bonus = parseInt(req.body.deposit_amount) / 2;
//     user.set({
//       final_balance:
//         parseInt(user.final_balance) + parseInt(req.body.deposit_amount),
//       // has_made_deposit: true,
//       made_first_deposit: true,
//       first_deposit:
//         user.first_deposit > 0
//           ? user.first_deposit
//           : parseInt(req.body.deposit_amount),
//     });
//     transaction.set({ status: "success" });

//     // const total_deposit = await Total_deposit.find();
//     // total_deposit[0].set({
//     //   total_deposit:
//     //     parseInt(total_deposit[0].total_deposit) +
//     //     parseInt(req.body.deposit_amount),
//     // });
//     // await total_deposit.save();

//     await Deposit_request.findByIdAndDelete(req.body.deposit_request);

//     await transaction.save();
//     await user.save();

//     transporter.sendMail(
//       create_mail_options({
//         first_name: user.first_name,
//         last_name: user.last_name,
//         reciever: user.email,
//       }),
//       (err, info) => {
//         if (err) return console.log(err.message);
//         console.log(info);
//         // return res.status(400).json({
//         //   error: true,
//         //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
//         // });
//       },
//     );
//     res
//       .status(200)
//       .json({ error: false, message: "success, you approved a loan" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error: true, errMessage: error.message });
//   }
// });
// module.exports = Router;
