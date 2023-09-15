const express = require("express");
const Router = express.Router();
const validateUser = require("../validation/validate_user");
const genToken = require("../token/genToken");
const hashPassword = require("../hash/hashPassword");
const User = require("../model/user");
const {
  create_mail_options,
  transporter,
} = require("../mailer/reg_success_mail");

const {
  create_referral_mail_options,
  referral_transporter,
} = require("../mailer/referral_mail");

Router.post("/", async (req, res) => {
   try {
  console.log(req.body);
     const isvalid = validateUser(req.body);
     if (isvalid != true)
       return res.status(400).json({ error: true, errMessage: isvalid });

     const user = await User.findOne({ email: req.body.email });
     if (user)
       return res
         .status(400)
         .json({ error: true, errMessage: "user already exist, please login" });

     const username = await User.findOne({ username: req.body.username });
    //  console.log(username);
     if (username)
       return res.status(400).json({
         error: true,
         errMessage: "Username already exist, please try a diffrent one",
       });

     const password = await hashPassword(req.body.password);
     const newUser = await new User({
       full_name: req.body.full_name.toUpperCase(),
       username: req.body.username,
       email: req.body.email,
       // country: req.body.country,
       password,
       // referral_link: `http://localhost:5000?${req.body.username}`,
       //  referral_link: `http://localhost:3000?${req.body.username}`,
       referral_link: `https://bristolenergy.info?${req.body.username}`,
       referral: req.body.referral,
     });

     const result = await newUser.save();

     const referral = await User.findOne({ username: req.body.referral });
     if (referral) {
       referral_transporter.sendMail(
         create_referral_mail_options({
           reciever: referral.email,
           referred_user: req.body.full_name.toUpperCase(),
         }),
       );
     }

     transporter.sendMail(
       create_mail_options({
         full_name: result.full_name,
         reciever: result.email,
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
     // console.log("user", result);
     const token = genToken(result._id);
     res.status(200).json({
       error: false,
       message: { user: result._id },
       token,
     });
   } catch (err) {
     return res.status(400).json({ error: true, errMessage: err.message });
   }
});

module.exports = Router;
