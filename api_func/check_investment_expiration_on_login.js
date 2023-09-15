const User = require("../model/user");
const Investment = require("../model/investment");

const current_date = () => {
  let currentdate = new Date();
  let datetime = `${currentdate.getFullYear()}-${
    currentdate.getMonth() + 1
  }-${currentdate.getDate()} -  ${currentdate.getHours()}: ${currentdate.getMinutes()} : ${currentdate.getSeconds()}`;
  return datetime;
};


const add_fundsto_depositmethod = async (depositInfo) => {
  switch (depositInfo.user.last_deposit_method) {
    case "BITCOIN":
      depositInfo.user.set({
        bitcoin_balance:
          parseInt(depositInfo.user.bitcoin_balance) +
          parseInt(depositInfo.investment.amount),
      });
      await depositInfo.user.save();
      break;

    case "ETHEREUM":
      depositInfo.user.set({
        ethereum_balance:
          parseInt(depositInfo.user.ethereum_balance) +
          parseInt(depositInfo.investment.amount),
      });
      await depositInfo.user.save();
      break;

    case "USDT(TRC20)":
      depositInfo.user.set({
        usdt_balance:
          parseInt(depositInfo.user.usdt_balance) +
          parseInt(depositInfo.investment.amount),
      });
      await depositInfo.user.save();
      break;

    case "PERFECT MONEY":
     depositInfo.user.set({
       perfect_money_balance:
         parseInt(depositInfo.user.perfect_money_balance) +
         parseInt(depositInfo.investment.amount),
     });
      await depositInfo.user.save();
      break;

    case "PAYEER":
      depositInfo.user.set({
        payer_balance:
          parseInt(depositInfo.user.payer_balance) +
          parseInt(depositInfo.investment.amount),
      });
      await depositInfo.user.save();
      break;

    case "BNB":
      depositInfo.user.set({
        bnb_balance:
          parseInt(depositInfo.user.bnb_balance) +
          parseInt(depositInfo.investment.amount),
      });
      await depositInfo.user.save();
      break;

    default:

  depositInfo.user.set({
    usdt_balance:
      parseInt(depositInfo.user.usdt_balance) +
      parseInt(depositInfo.investment.amount),
  });
  await depositInfo.user.save();
      break;
  }
};

const cancel_investment = async (investment) => {
  try {
    const user = await User.findById(investment.user);
    if (!user)
      return {
        error: true,
        errMessage:
          "invalid request, user please login again to fetch investment",
      };

    user.set({
      final_balance:
        parseInt(user.final_balance) +
        parseInt(investment.amount) +
        parseInt(investment.pending_profit),

      active_investment:
        parseInt(user.active_investment) - parseInt(investment.amount),
    });


add_fundsto_depositmethod({user,investment})

    user.save();
    await Investment.findByIdAndDelete(investment._id);
    return { error: false, message: "success, you cancelled an investment" };
  } catch (error) {
    return { error: true, errMessage: error.message };
  }
};

const check_inv_expiration = async (userID) => {
  console.log("called with a user id of", userID);
  try {
    const investments = await Investment.find({ user: userID });
    if (investments.length < 1)
      return {
        error: true,
        errMessage: "sorry,you have not made any investment",
      };

    let up_date = new Date();
    up_date.setDate(up_date.getDate());
    let today = up_date.getTime();

    investments.forEach(async (investment) => {
      if (parseInt(investment.investment_end_date) <= parseInt(today)) {
        return await cancel_investment(investment);
        // return c_inv;
      } else {
        return {
          error: false,
          message: "investment is still in proccess and has'nt ended",
        };
      }
    });
  } catch (error) {
    return { error: true, errMessage: error.message };
  }
};
module.exports = check_inv_expiration;
