const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const verifyToken = require("../token/verifyToken");
// const cloudinary = require("../file_handler/cloudinary");
// const upload = require("../file_handler/multer");
// const fs = require("fs");
// const { create_mail_options, transporter } = require("../mailer/deposit_email");
const validate_complete_deposit = require("../validation/validate_complete_deposit");
const Deposit_request = require("../model/deposit_request");

Router.post("/", verifyToken, async (req, res) => {
  // console.log(req.body);
   try {
     const request_isvalid = validate_complete_deposit(req.body);
     if (request_isvalid != true)
       return res
         .status(400)
         .json({ error: true, errMessage: request_isvalid });

     const user = await User.findById(req.body.user);
     if (!user)
       return res.status(400).json({
         error: true,
         errMessage:
           "an unexpected error occured, please login again to submit receipt",
       });

     const deposit_request_result = await Deposit_request.findOne({
       user: req.body.user,
       _id: req.body.deposit_request_id,
     });
     if (!deposit_request_result)
       return res.status(404).json({
         error: true,
         errMessage:
           "deposit not found,before you submit a transction hash you need to first make a deposit ",
       });

     // const uploader = async (path) => await cloudinary.uploads(path, "receipt");
     // let receipt_url;
     // const files = req.files;
     // for (const file of files) {
     //   const { path } = file;
     //   const newPath = await uploader(path);
     //   receipt_url = newPath;
     //   fs.unlinkSync(path);
     // }
     // console.log(receipt_url);
     // if (receipt_url.error)
     //   return res.status(400).json({
     //     error: true,
     //     errMessage:
     //       "Something went wrong in the server while trying to upload your receipt, please make sure receipt is an image and try again",
     //   });

     const result = deposit_request_result.set({
       transaction_hash: req.body.transaction_hash,
     });
     await result.save();

     // transporter.sendMail(
     //   create_mail_options({
     //     first_name: user.first_name,
     //     last_name: user.last_name,
     //     reciever: user.email,
     //   }),
     //   (err, info) => {
     //     if (err) return console.log(err.message);
     //     console.log(info);
     //     // return res.status(400).json({
     //     //   error: true,
     //     //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
     //     // });
     //   },
     // );

     res
       .status(200)
       .json({ error: false, message: "successfully uploaded hash" });
   } catch (error) {
     // console.log(error);
     res.status(400).json({ error: true, errMessage: error.message });
   }
});
module.exports = Router;
