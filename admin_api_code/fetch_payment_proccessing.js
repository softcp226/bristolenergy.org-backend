const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Payment_proccessing = require("../model/proccessings");
const validate_admin = require("../validation/validate-admin-dashboard");
const validate_admin_delete_proccessing = require("../validation/validate_admin_delete_proccessing");
const validat_fetchOne_payment_proccessing = require("../validation/validate_admin_fetchone_payment_proccessing");
const Admin = require("../model/admin");

Router.post("/fetch", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    const payment_proccessing = await Payment_proccessing.find();
    if (payment_proccessing.length < 1)
      return res
        .status(400)
        .json({
          error: true,
          errMessage: "No payment procccessor has been created",
        });

    res.status(200).json({ error: false, message: payment_proccessing });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});





Router.post("/fetchOne", verifyToken, async (req, res) => {
  const request_isvalid = validat_fetchOne_payment_proccessing(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    const payment_proccessing = await Payment_proccessing.findById(req.body.proccessing_id);
    if (!payment_proccessing)
      return res.status(400).json({
        error: true,
        errMessage: "No payment procccessor has been created",
      });

    res.status(200).json({ error: false, message: payment_proccessing });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});



Router.delete("/delete", verifyToken, async (req, res) => {
  const request_isvalid = validate_admin_delete_proccessing(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });

  try {
    const admin = await Admin.findById(req.body.admin);
    if (!admin)
      return res.status(403).json({
        error: true,
        errMessage: "Forbidden!, please login again to access this api",
      });

    await Payment_proccessing.findByIdAndDelete(req.body.payment_proccessor_ID);

    res
      .status(200)
      .json({
        error: false,
        message: "success, you deleted a payment proccessor.",
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

module.exports = Router;
