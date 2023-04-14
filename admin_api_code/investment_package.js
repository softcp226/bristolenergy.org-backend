const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Investment_Package = require("../model/investment-package");
const Admin = require("../model/admin");
const validate_admin_fetch_investment_package_one = require("../validation/validate_admin_fetch_investment_package");
const validate_admin_add_investment = require("../validation/validate_admin_add_investment_package");
const validate_fetch_all_investment_program = require("../validation/validate_admin_fetch_all_investment_packages");
const validate_admin_edit_investment = require("../validation/validate_admin_edit_investment_package");
const validate_admin_delete_investment_package = require("../validation/validate_admin_delete_package");

Router.post("/", verifyToken, async (req, res) => {
  const request_isvalid = validate_fetch_all_investment_program(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });
    const investment_Packages = await Investment_Package.find();
    if (investment_Packages.length < 1)
      return res.status(400).json({
        error: true,
        errMessage: "No investment package has been created at the moment",
      });
    res.status(200).json({ error: false, message: investment_Packages });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.post("/add", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_add_investment(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    new_investment_package = await new Investment_Package({
      package_name: req.body.package_name,
      package_door: req.body.package_door,
      package_status: req.body.package_status,
      payment_period: req.body.payment_period,
      min: req.body.min,
      max: req.body.max,
      percentage: req.body.percentage,
    });
    await new_investment_package.save();
    res.status(200).json({ error: false, message: new_investment_package });

    //   await investment_package.save();
    //   res.status(200).json({
    //     error: false,
    //     message: "investment package updated successfully.",
    //   });
    // }
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.post("/edit", verifyToken, async (req, res) => {
  console.log(req.body);
  const request_isvalid = validate_admin_edit_investment(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    const investment_package = await Investment_Package.findById(
      req.body.package_id,
    );
    if (!investment_package)
      return res.status(400).json({
        error: true,
        errMessage: "the investment pckage you tried to update does not exist",
      });

    await investment_package.set({
      package_name: req.body.package_name,
      package_door: req.body.package_door,
      package_status: req.body.package_status,
      payment_period: req.body.payment_period,
      min: req.body.min,
      max: req.body.max,
      percentage: req.body.percentage,
    });
    await investment_package.save();
    res.status(200).json({ error: false, message: "success" });

    //   await investment_package.save();
    //   res.status(200).json({
    //     error: false,
    //     message: "investment package updated successfully.",
    //   });
    // }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.post("/fetch", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_fetch_investment_package_one(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const investment_package = await Investment_Package.findById(
      req.body.package_id,
    );
    if (!investment_package)
      return res.status(404).json({
        error: true,
        errMessage: "no investment package with that ID was found",
      });
    res.status(200).json({ error: false, message: investment_package });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.delete("/delete", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_delete_investment_package(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const investment_package = await Investment_Package.findById(
      req.body.package_id,
    );
    if (!investment_package)
      return res.status(404).json({
        error: true,
        errMessage:
          "The investment package with you tried to delete does not exist",
      });

    await Investment_Package.findByIdAndDelete(req.body.package_id);
    res.status(200).json({ error: false, message: "success" });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;
