const set_deposit_method = async (user, deposit_amount, payment_method) => {
  switch (payment_method) {
    case "BITCOIN":
      user.set({
        bitcoin_balance: user.bitcoin_balance + parseInt(deposit_amount),
      }),
        await user.save();
      break;

    case "ETHEREUM":
      user.set({
        ethereum_balance: user.ethereum_balance + parseInt(deposit_amount),
      });
      await user.save();
      break;

    case "USDT(TRC20)":
      user.set({
        usdt_balance: user.usdt_balance + parseInt(deposit_amount),
      });
      await user.save();
      break;

    case "PERFECT MONEY":
      user.set({
        perfect_money_balance:
          user.perfect_money_balance + parseInt(deposit_amount),
      });
      await user.save();
      break;

    case "PAYEER":
      user.set({
        payer_balance: user.payer_balance + parseInt(deposit_amount),
      });
      await user.save();
      break;

    case "BNB":
      user.set({
        bnb_balance: user.bnb_balance + parseInt(deposit_amount),
      });
      await user.save();
      break;

    default:
      user.set({
        bitcoin_balance: user.bitcoin_balance + parseInt(deposit_amount),
      });
      await user.save();
      break;
  }
};

module.exports = set_deposit_method;
