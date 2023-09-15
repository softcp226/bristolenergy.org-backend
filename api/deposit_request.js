// const express = require("express");
// const { validate } = require("../model/user");
// const Router = express.Router();
// const User = require("../model/user");
// const verifyToken = require("../token/verifyToken");
// const validate_deposit_request = require("../validation/validate_deposit_request");
// const create_deposit = require("../shape-model/create-deposit");
// const { create_mail_options, transporter } = require("../mailer/deposit_email");

// Router.post("/", verifyToken, async (req, res) => {
//   const request_isvalid = validate_deposit_request(req.body);
//   if (request_isvalid != true)
//     return res.status(400).json({ error: true, errMessage: request_isvalid });
//   try {
//     const user = await User.findById(req.body.user);
//     if (!user)
//       return res.status(404).json({
//         error: true,
//         errMessage: "invalid request, please login again to make a deposit",
//       });
//     const create_deposit_request = await create_deposit(req);
//     // console.log("deposit amount", req.body.deposit_amount);

//     // if (parseInt(req.body.deposit_amount) < 100)
//     //   return res.status(400).json({
//     //     error: true,
//     //     errMessage:
//     //       "deposit amount must not be lesser than minimum deposit of $100 USD",
//     //   });

//     transporter.sendMail(
//       create_mail_options({
//         // first_name: user.first_name,
//         // last_name: user.last_name,
//         full_name:user.full_name,
//         reciever: user.email,
//         amount: req.body.deposit_amount,
//       }),
//       (err, info) => {
//         if (err) return console.log(err.message);
//         console.log(info);
//         // return res.status(400).json({
//         //   error: true,
//         //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
//         // });
//       }
//     );

//     res.status(200).json({ error: false, message: create_deposit_request._id });
//   } catch (error) {
//     res.status(400).json({ error: true, errMessage: error.message });
//   }
// });
// module.exports = Router;



































const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const Deposit_request = require("../model/deposit_request");
const verifyToken = require("../token/verifyToken");
const validate_deposit_request = require("../validation/validate_deposit_request");
const validate_fetch_deposit_request = require("../validation/validate_fetch_deposit_request.js");
const create_deposit = require("../shape-model/create-deposit");
const { create_mail_options, transporter } = require("../mailer/deposit_email");

Router.post("/", verifyToken, async (req, res) => {
    try {
      const request_isvalid = validate_deposit_request(req.body);
      if (request_isvalid != true)
        return res
          .status(400)
          .json({ error: true, errMessage: request_isvalid });

      const user = await User.findById(req.body.user);
      if (!user)
        return res.status(404).json({
          error: true,
          errMessage: "invalid request, please login again to make a deposit",
        });

         if (parseInt(req.body.deposit_amount) < 50)
        return res.status(400).json({
          error: true,
          errMessage:
            "deposit amount must not be lesser than minimum deposit of $50",
        });

        
      const create_deposit_request = await create_deposit(req);
      // console.log("deposit amount", req.body.deposit_amount);

     
      transporter.sendMail(
        create_mail_options({
          // first_name: user.first_name,
          // last_name: user.last_name,
          full_name: user.full_name,
          reciever: user.email,
          deposit_amount: req.body.deposit_amount,
          deposit_method: req.body.payment_method,
        }),
        (err, info) => {
          if (err) return err.message;
          // console.log(info);
          // return res.status(400).json({
          //   error: true,
          //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
          // });
        },
      );

      res
        .status(200)
        .json({ error: false, message: create_deposit_request._id });
    } catch (error) {
      res.status(400).json({ error: true, errMessage: error.message });
    }
});

Router.post("/fetch", verifyToken, async (req, res) => {
  const request_isvalid = validate_fetch_deposit_request(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const user = await User.findById(req.body.user);
    if (!user)
      return res.status(404).json({
        error: true,
        errMessage: "invalid request, please login again to make a deposit",
      });

    const deposit_request = await Deposit_request.findById(
      req.body.deposit_request_id,
    );
    if (!deposit_request)
      return res.status(400).json({
        error: true,
        errMessage:
          "The deposit requested was not found, You can no longer continue proceed to make the payment. please start all over ",
      });
    res.status(200).json({ error: false, message: deposit_request });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
