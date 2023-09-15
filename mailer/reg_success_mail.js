//  const transporter = nodemailer.createTransport(
//    smtpTransport({
//      host: "mail.cryptocom-mining.com",
//      secureConnection: false,
//      tls: {
//        rejectUnauthorized: false,
//      },
//      port: 587,
//      auth: {
//        user: "support@cryptocom-mining.com",
//        pass: "bishop1@1",
//      },
//    }),
//  );

const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();
// let transporter = nodemailer.createTransport({
//   service: "Gmail",
//   secure: false,

//   auth: {
//     user: "panteramining642@gmail.com",
//     // pass: "desolidboy1",
//     pass: "cvqydopvaddyfnfi",
//     // secure:false,
//   },
// });

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: process.env.host,
    secureConnection: false,
    tls: {
      rejectUnauthorized: false,
    },
    port: 465,
    auth: {
      user: process.env.company_mail,
      pass: process.env.mail_password,
    },
  }),
);

let create_mail_options = (userInfo) => {
  return (mailOptions = {
    from: process.env.company_mail,
    // from:"michelleannschlloser@outlook.com",
    to: userInfo.reciever,
    subject: `Account Registration Notification`,
    //   text:"just wanna know if this works",
    html: `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Nunito&family=Roboto&display=swap"
  rel="stylesheet"
/>
<div
  class="maincontainer"
  style="
    font-family: 'Nunito', sans-serif;
    font-family: 'Roboto', sans-serif;
    background-image: url(https://edustair.com/assets/img/360_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg);
    width: 100%;
    background-size: cover;
  "
>
 <div style="text-align: center;">
    <img src="https://bristolenergy.info/assets/images/logo'.png" style="width: 40px; text-align: center; margin: auto;" alt="Logo">
</div>

  <div class="head-txt">
    <h3 style="font-size: 15px">NEW ACCOUNT NOTIFICATION</h3>
  </div>

  <p class="sm-p">
    Dear ${userInfo.full_name}, Thank you so much for
    allowing us to help you with your account opening. We are committed to
    providing our customers with the highest level of service and the most
    innovative investment and trading that are possible.
  </p>
  
  <br />
  <h1
    style="
      font-size: 18px;
      text-align: center;
      background: linear-gradient(87deg, #041d9b 0, #041d9b 100%);
      color: #fff;
    "
  >
    BRISTOLENERGY
  </h1>
  <p class="disclaimer" style="font-size: 12px; font-weight: bolder">
      Disclaimer: this message was automatically generated via bristolenergy
      secured channel,please do not reply to this message. All correspondence
      should be addressed to bristolenergy.info or your relationship officer
    </p>

</div>

 `,
  });
};
module.exports = { create_mail_options, transporter };

// transporter.sendMail(
//   create_mail_options({
//     first_name: "chidera",
//     last_name: "Nweke",
//     reciever: "chideranwofe02@gmail.com",
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
// transporter.sendMail(mailOptions, (err, info) => {
//   if (err)
//     return res
//       .status(400)
//       .json({ error: true, errMessage: `an error occured: ${err.message}` });
//   // console.log(info)
//   return res.status(200).json({ error: false, message: "message sent" });
//   // console.log("message sent",info)
// });

// //   if (err)
// //     return { error: true, errMessage: `an error occured: ${err.message}` };
// //   // console.log(info)
// //   return { error: false, message: "message sent" };
// // });
// };
