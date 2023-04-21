const check_withdrawal_method = async (
  user,
  withdrawal_amount,
  withdrawal_method,
) => {
  // console.log(
  //   "called",
  //   `user:${user} withdrawal amount:${withdrawal_amount} method:${withdrawal_method}`,
  // );
  try {
    switch (withdrawal_method) {
      case "BITCOIN":
        if (parseInt(withdrawal_amount) > parseInt(user.bitcoin_balance))
          return {
            error: true,
            errMessage:
              "you have insufficient BITCOIN balance please try to withdraw using another method",
          };
        user.set({
          bitcoin_balance:
            parseInt(user.bitcoin_balance) - parseInt(withdrawal_amount),
        });
        await user.save();
        return { error: false };
        break;

      case "ETHEREUM":
        if (parseInt(withdrawal_amount) > parseInt(user.ethereum_balance))
          return {
            error: true,
            errMessage:
              "you have insufficient ETHEREUM balance please try to withdraw using another method",
          };
        user.set({
          ethereum_balance:
            parseInt(user.ethereum_balance) - parseInt(withdrawal_amount),
        });
        await user.save();
        return { error: false };
        break;

      case "USDT(TRC20)":
        if (parseInt(withdrawal_amount) > parseInt(user.usdt_balance))
          return {
            error: true,
            errMessage:
              "you have insufficient USDT(TRC20) balance please try to withdraw using another method",
          };
        user.set({
          usdt_balance:
            parseInt(user.usdt_balance) - parseInt(withdrawal_amount),
        });
        await user.save();
        return { error: false };

        break;

      case "PERFECT MONEY":
        if (parseInt(withdrawal_amount) > parseInt(user.perfect_money_balance))
          return {
            error: true,
            errMessage:
              "you have insufficient PERFECT MONEY balance please try to withdraw using another method",
          };
        user.set({
          perfect_money_balance:
            parseInt(user.perfect_money_balance) - parseInt(withdrawal_amount),
        });
        await user.save();
        return { error: false };

        break;

      case "PAYEER":
        if (parseInt(withdrawal_amount) > parseInt(user.payer_balance))
          return {
            error: true,
            errMessage:
              "you have insufficient PAYEER balance please try to withdraw using another method",
          };
        user.set({
          payer_balance:
            parseInt(user.payer_balance) - parseInt(withdrawal_amount),
        });
        await user.save();
        return { error: false };

        break;


      case "BNB":
        if (parseInt(withdrawal_amount) > parseInt(user.bnb_balance))
          return {
            error: true,
            errMessage:
              "you have insufficient BNB balance please try to withdraw using another method",
          };
        user.set({
          bnb_balance:
            parseInt(user.bnb_balance) - parseInt(withdrawal_amount),
        });
        await user.save();
        return { error: false };

        break;

      default:
        if (parseInt(withdrawal_amount) > parseInt(user.bitcoin_balance))
          return {
            error: true,
            errMessage:
              "you have insufficient BITCOIN balance please try to withdraw using another method",
          };
        user.set({
          bitcoin_balance:
            parseInt(user.bitcoin_balance) - parseInt(withdrawal_amount),
        });
        await user.save();
        return { error: false };

        break;
    }
  } catch (error) {
    return { error: true, errMessage: error.message };
  }
};
module.exports = check_withdrawal_method;
