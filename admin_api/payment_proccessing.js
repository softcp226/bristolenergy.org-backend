const express = require("express");
const Router = express.Router();
const verifyToken = require("../secure-admin-api/verifyToken");
const Payment_proccessing = require("../model/proccessings");
const validate_admin_add_payment_proccessing = require("../validation/validate_admin_add_proccessing");
const validate_admin_edit_payment_proccessing = require("../validation/validate_admin_edit_proccessing");
const Admin = require("../model/admin");

Router.post("/", verifyToken, async (req, res) => {


  try {
    const request_isvalid = validate_admin_add_payment_proccessing(req.body);
    if (request_isvalid != true)
      return res.status(400).json({ error: true, errMessage: request_isvalid });

       const admin = await Admin.findById(req.body.admin);
       if (!admin)
         return res.status(403).json({
           error: true,
           errMessage: "Forbidden!, please login again to access this api",
         });

    const payment_proccessing = await new Payment_proccessing({
      name: req.body.name.toUpperCase(),
      icon: req.body.icon,
      status: req.body.status,
      wallet_address: req.body.wallet_address,
    });
    await payment_proccessing.save();
    res.status(200).json({ error: false, message: "success!" });
  } catch (error) {
    // console.log(error)
    res.status(400).json({ error: true, errMessage: error.message });
  }
});

Router.post("/edit", verifyToken, async (req, res) => {
  
  try {
    const request_isvalid = validate_admin_edit_payment_proccessing(req.body);
    if (request_isvalid != true)
      return res.status(400).json({ error: true, errMessage: request_isvalid });

       const admin = await Admin.findById(req.body.admin);
       if (!admin)
         return res.status(403).json({
           error: true,
           errMessage: "Forbidden!, please login again to access this api",
         });

    const payment_proccessing = await Payment_proccessing.findById(
      req.body.proccesing_id,
    );
    if (!payment_proccessing)
      return res.status(400).json({
        error: true,
        errMessage: "The proccessing you tried updating does not exist",
      });
    await payment_proccessing.set({
      name: req.body.name.toUpperCase(),
      icon: req.body.icon,
      status: req.body.status,
      wallet_address: req.body.wallet_address,
    });
    await payment_proccessing.save();
    res.status(200).json({ error: false, message: payment_proccessing });
  } catch (error) {
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;
