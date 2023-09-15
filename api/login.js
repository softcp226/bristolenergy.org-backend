const express = require("express");
const Router = express.Router();
const User = require("../model/user");
const genToken = require("../token/genToken");
const verifyPassword = require("../hash/comparePassword");
const validateLogin = require("../validation/validateLogin");
const check_investment_expiration_on_login = require("../api_func/check_investment_expiration_on_login");

Router.post("/", async (req, res) => {
    try {
      const isvalid = validateLogin(req.body);
      if (isvalid != true)
        return res.status(400).json({ error: true, errMessage: isvalid });

      const user = await User.findOne({ username: req.body.username });
      // console.log("use", user);
      if (!user)
        return res
          .status(400)
          .json({ error: true, errMessage: "invalid Username or Password " });

      // console.log("user", user);

      // if (!user.password)
      //   return res.status(403).json({
      //     error: true,
      //     errMessage:
      //       "Register again with these email, your previous registration was not complete",
      //   });
      const passwordIsverified = await verifyPassword(
        req.body.password,
        user.password,
      );
      // console.log(passwordIsverified);
      if (passwordIsverified != true)
        return res
          .status(400)
          .json({ error: true, errMessage: "invalid Email or password " });
      // console.log("user status", user.status);
      if (user.status == "disabled")
        return res.status(403).json({
          error: true,
          errMessage:
            "Your account has been disabled, you can't login at the moment and you cant earn from any investment if you created one earlier. Most common reasons are because you did not follow our community standard. For more information contact customer support now",
        });
      const token = genToken(user._id);

      const check_inv_exp_result = await check_investment_expiration_on_login(
        user._id,
      );
      // console.log(await check_inv_exp_result);

      res.status(200).json({
        error: false,
        message: { user: user._id },
        token,
      });
    } catch (err) {
      res.status(400).json({ error: true, errMessage: err.message });
    }
});

module.exports = Router;
