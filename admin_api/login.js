// const express = require("express");
// const Router = express.Router();
// const genToken = require("../secure-admin-api/genToken");
// const Admin = require("../model/admin");
// const validate_admin = require("../validation/validate-login-admin");
// const compare_passsword = require("../admin-hash/compare_password");
// Router.post("/", async (req, res) => {
//   const request_isvalid = validate_admin(req.body);
//   if (request_isvalid != true)
//     return res.status(400).json({ error: true, errMessage: request_isvalid });
//   try {
//     const admin = await Admin.findOne({ user_name: req.body.user_name });
//     if (!admin)
//       return res.status(400).json({
//         error: true,
//         errMessage: "invalid user name or password (mail does not exist)",
//       });
//     const password_match = await compare_passsword(
//       req.body.password,
//       admin.password
//     );
//     if (!password_match)
//       return res.status(400).json({
//         error: true,
//         errMessage: "invalid user name or password (pass err)",
//       });
//     const token = genToken(admin._id);
//     res
//       .status(200)
//       .json({ error: false, message: { token, admin: admin._id } });
//   } catch (error) {
//     res.status(400).json({ error: true, errMessage: error.message });
//   }
// });
// module.exports = Router;

const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const genToken = require("../secure-admin-api/genToken");
const Admin = require("../model/admin");
const validate_admin = require("../validation/validate-login-admin");
const compare_passsword = require("../admin-hash/compare_password");

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT_MINUTES = 5;

// Rate limiting middleware
const rateLimit = require("express-rate-limit")({
  windowMs: LOGIN_TIMEOUT_MINUTES * 60 * 5000,
  max: MAX_LOGIN_ATTEMPTS,
  message: {
    error: true,
    errMessage: "Too many login attempts. Please try again later.",
  },
});

Router.post("/", rateLimit, async (req, res) => {
  // console.log(req.body)
  try {
    const request_isvalid = validate_admin(req.body);
    if (request_isvalid !== true) {
      return res.status(400).json({ error: true, errMessage: request_isvalid });
    }

    const admin = await Admin.findOne({ user_name: req.body.user_name });
    if (!admin) {
      return res.status(400).json({
        error: true,
        errMessage: "Invalid user name or password",
      });
    }

    // const password_match = await bcrypt.compare(
    //   req.body.password,
    //   admin.password,
    // );
    const password_match = await compare_passsword(
      req.body.password,
      admin.password,
    );

    if (password_match != true) {
      return res.status(400).json({
        error: true,
        errMessage: "Invalid user name or password",
      });
    }

    const token = genToken(admin._id);
    res
      .status(200)
      .json({ error: false, message: { token, admin: admin._id } });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;


// console