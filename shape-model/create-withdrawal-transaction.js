const Transaction = require("../model/transaction");
const { datetime, coded_date } = require("../shape-model/system-variables");
const Withdrawal_request = require("../model/withdrawal_request");
const create_withdrawal_transaction = async (req) => {
  let ref = Math.floor(Math.random() * 100);

  const transaction = await new Transaction({
    user: req.body.user,
    refrence_number: `#Withdrawal `,
    transaction_date: datetime,
    coded_date,

    debit: `$${req.body.withdrawal_amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    status: "pending",
  });

  const withdrawal_request = await new Withdrawal_request({
    user: req.body.user,
    transaction_date: datetime,
    withdrawal_amount: req.body.withdrawal_amount,
    withdrawal_method: req.body.withdrawal_method,
    transaction: transaction._id,
    wallet: req.body.wallet,
  });

  transaction.set({ withdrawal_request: withdrawal_request._id });

  Promise.all([await withdrawal_request.save(),
  await transaction.save()])
  return transaction;
};

module.exports = create_withdrawal_transaction;
