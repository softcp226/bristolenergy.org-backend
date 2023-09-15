const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

var corsOptions = {
  //   origin: "https://bristolenergy.info",
  origin: [
    "http://localhost:3000",
    "https://bristolenergy.info",
    "http://bristolenergy.info",
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(helmet());
// app.use("/", express.static("html"));

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);

const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "your-service-name" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

app.use((req, res, next) => {
  logger.info(`Endpoint ${req.method} ${req.originalUrl} was accessed`, {
    // user_id: req.user.id,
    req: req.body,
  });
  next();
});

app.post("/", (req, res) =>
  res.status(200).json({ error: false, message: req.body }),
);

const fetch_investment_packages = require("./api/fetch_investment_program");
app.use("/api/investment_packages/fetch", fetch_investment_packages);
const fetch_last_10_withdrawals$deposit = require("./admin_api/fetch_last_10_withdrawals&deposit");
app.use("/last_10_withdrawals&deposit", fetch_last_10_withdrawals$deposit);

// app.use("/admin", express.static("admin"));
const admin_login = require("./admin_api/login");
app.use("/api/admin/login", admin_login);
const admin_fetchuser = require("./admin_api/fetch_user");
app.use("/api/admin/fetch_users", admin_fetchuser);
const admin_deleteuser = require("./admin_api/delete_user");
app.use("/api/admin/users/delete_user", admin_deleteuser);
const admin_fetch_deposit_request = require("./admin_api/fetch_deposit_request");
app.use("/api/admin/deposit_request", admin_fetch_deposit_request);
const approve_deposit = require("./admin_api/approve_deposit");
app.use("/api/admin/deposit/approve", approve_deposit);

const expiring_deposit = require("./admin_api/fetch_expiring_deposit");
app.use("/api/admin/expiring_deposit", expiring_deposit);

const fetch_payment_proccessing = require("./admin_api/fetch_payment_proccessing");
app.use("/api/admin/payment_proccessing", fetch_payment_proccessing);

const admin_approve_withdrawal = require("./admin_api/approve_withdrawal");
app.use("/api/admin/withdrawal/approve", admin_approve_withdrawal);

const user_edit = require("./admin_api/edit_user");
app.use("/api/admin/user/edit", user_edit);

const admin_fetch_dashboard_details = require("./admin_api/dashboard");
app.use("/api/admin/dashboard/details", admin_fetch_dashboard_details);
//dashboard
const fund_user = require("./admin_api/fund_user");
app.use("/api/admin/user/fund", fund_user);
const admin_fetch_investment = require("./admin_api/fetch_investment");
app.use("/api/admin/investment/fetch", admin_fetch_investment);
const admin_cancel_investment = require("./admin_api/cancel_investment");
app.use("/api/admin/investment/cancel", admin_cancel_investment);
const admin_fetch_withdrawal = require("./admin_api/fetch_withdrawal");
app.use("/api/admin/withdrawal/fetch", admin_fetch_withdrawal);
const investment_packages = require("./admin_api/investment_package");
app.use("/api/admin/investment_packages", investment_packages);
const payment_proccessing = require("./admin_api/payment_proccessing");
app.use("/api/admin/payment/proccessing", payment_proccessing);

const admin_fetch_transactions = require("./admin_api/fetch_transction");
app.use("/api/admin/transactions/fetch", admin_fetch_transactions);

const admin_setting = require("./admin_api/settings");
app.use("/api/admin/setting", admin_setting);

const fetch_top_referral = require("./admin_api/fetch_top_referral");
app.use("/api/admin/user/top_referral", fetch_top_referral);

const fetch_referral = require("./api/fetch_referrals");
app.use("/api/user/referral/fetch", fetch_referral);

const login = require("./api/login");
app.use("/api/user/login", login);
const register = require("./api/register");
app.use("/api/newuser/register", register);
// const complete_registration = require("./api/complete-registration");
// app.use("/api/new_user/complete_registration", complete_registration);
// /api/admin/deposit_request
const find_user = require("./api/find_user");
app.use("/api/user/find", find_user);

const fetch_user = require("./api/fetch-user");
app.use("/api/user/fetch", fetch_user);
const update_user = require("./api/update-user");
app.use("/api/user/update", update_user);

const create_new_deposit = require("./api/deposit_request");
app.use("/api/user/create_deposit", create_new_deposit);
const complete_deposit = require("./api/complete_deposit");
app.use("/api/user/deposit/complete", complete_deposit);
const fetch_transactions = require("./api/fetch_transactions");
app.use("/api/user/transactions/fetch", fetch_transactions);
const create_investment = require("./api/create_investment");
app.use("/api/user/create_investment", create_investment);

const cancel_investment = require("./api/cancel_investment");
app.use("/api/user/investment/cancel", cancel_investment);

const fetch_investment = require("./api/fetch_investment");
app.use("/api/user/investments/fetch", fetch_investment);

const withdrawal = require("./api/withdraw");
app.use("/api/user/withdraw", withdrawal);

const user_fetch_payment_proccessing = require("./api/fetch_payment_proccessing");
app.use("/api/user/fetch_payment_proccessing", user_fetch_payment_proccessing);

const forgotten_password = require("./api/forgotten-password");
app.use("/api/password/forgotten", forgotten_password);
const reset_password = require("./api/reset-password");
app.use("/api/user/password/reset", reset_password);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`running on port ${port}`));
// /api/user/transactions/fetch

// /api/user/create_investment
///api/admin/user/edit




// /api/user/fetch_payment_proccessing