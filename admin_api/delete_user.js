// const express = require("express");
// const Router = express.Router();
// const verifyToken = require("../secure-admin-api/verifyToken");
// const User = require("../model/user");
// const Admin = require("../model/admin");
// const validate_request = require("../validation/validate_admin_delete_user");

// Router.delete("/", verifyToken, async (req, res) => {
//   const request_is_valid = validate_request(req.body);
//   if (request_is_valid != true)
//     return res.status(400).json({ error: true, errMessage: request_is_valid });

//   try {
//     const admin = await Admin.findById(req.body.admin);
//     if (!admin)
//       return res.status(403).json({
//         error: true,
//         errMessage: "Forbidden!, please login again to access this api",
//       });
//     req.body.users.forEach(async (user) => {
//       await User.findByIdAndDelete(user);
//     });

//     res.status(200).json({
//       error: false,
//       message: `${
//         req.body.users.length > 1
//           ? "you successfully deleted all the selected users"
//           : "You successfully deleted one user"
//       }`,
//     });
//   } catch (error) {
//     res.status(400).json({ error: true, errMessage: error.message });
//   }
// });

// module.exports = Router;







const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const User = require("../model/user");
const Admin = require("../model/admin");
const validate_request = require("../validation/validate_admin_delete_user");
// const rateLimit = require("express-rate-limit");
// const cors = require("cors");

// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 100, // limit each IP to 100 requests per minute
// });



Router.delete("/", verifyToken, async (req, res) => {
  const request_is_valid = validate_request(req.body);
  if (request_is_valid != true)
    return res.status(400).json({ error: true, errMessage: "Invalid request" });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden",
      });
    const users = await User.find({ _id: { $in: req.body.users } });
    if (users.length === 0) {
      return res.status(404).json({
        error: true,
        errMessage: "User not found",
      });
    }
    await User.deleteMany({ _id: { $in: req.body.users } });
    res.status(200).json({
      error: false,
      message: `${
        req.body.users.length > 1
          ? "You successfully deleted all the selected users"
          : "You successfully deleted one user"
      }`,
    });
  } catch (error) {
    res.status(500).json({ error: true, errMessage: "Internal server error" });
  }
});

module.exports = Router;
