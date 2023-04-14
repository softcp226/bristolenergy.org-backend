const express = require("express");
const Router = express.Router();
const hashPassword = require("../hash/hashPassword");
const validate_change_password = require("../validation/validate_change_password");
const User = require("../model/user");
const Recover_password = require("../model/recover-password");

Router.post("/", async (req, res) => {
  try {
    const pwd_in_goodshape = validate_change_password(req.body);
    if (pwd_in_goodshape != true)
      return res
        .status(400)
        .json({ error: true, errMessage: pwd_in_goodshape });

    const recover_password = await Recover_password.findOne({
      reset_token: req.body.reset_token,
    });
    if (!recover_password)
      return res.status(400).json({
        error: true,
        errMessage: "The link you followed is broken or no longer exist",
      });

    const user = await User.findById(recover_password.user);
    if (!user)
      return res.status(404).json({
        error: true,
        errMessage:
          "An unexpected error occured, please try reseting your password again.",
      });

    const password = await hashPassword(req.body.password);
    user.set({
      password: password,
      // pin: req.body.pin,
    });

    await Recover_password.findOneAndDelete({
      reset_token: req.body.reset_token,
    });

    const result = await user.save();
    res.status(200).json({
      error: false,
      message:
        "congratulations, you successfully updated your password and pin",
    });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
