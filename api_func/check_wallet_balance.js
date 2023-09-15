const check_wallet_balance = (walletInfo) => {
  switch (walletInfo.incominMessage.payment_method) {
    case "BITCOIN":
      if (
        parseInt(walletInfo.user.bitcoin_balance) >=
        parseInt(walletInfo.incominMessage.investment_amount)
      ) {
        walletInfo.user.set({
          bitcoin_balance:
            parseInt(walletInfo.user.bitcoin_balance) -
            parseInt(walletInfo.incominMessage.investment_amount),
        });
        return { error: false };
      }
      return {
        error: true,
        errMessage: "Insufficient BITCOIN balance , please try other currency.",
      };

      break;

    case "ETHEREUM":
      if (
        parseInt(walletInfo.user.ethereum_balance) >=
        parseInt(walletInfo.incominMessage.investment_amount)
      ) {
        walletInfo.user.set({
          ethereum_balance:
            parseInt(walletInfo.user.ethereum_balance) -
            parseInt(walletInfo.incominMessage.investment_amount),
        });
        return { error: false };
      }
      return {
        error: true,
        errMessage:
          "Insufficient ETHEREUM balance , please try other currency.",
      };

      break;

    case "USDT(TRC20)":
      if (
        parseInt(walletInfo.user.usdt_balance) >=
        parseInt(walletInfo.incominMessage.investment_amount)
      ) {
        walletInfo.user.set({
          usdt_balance:
            parseInt(walletInfo.user.usdt_balance) -
            parseInt(walletInfo.incominMessage.investment_amount),
        });
        return { error: false };
      }
      return {
        error: true,
        errMessage:
          "Insufficient USDT(TRC20) balance , please try other currency.",
      };

      break;

    case "PERFECT MONEY":
      if (
        parseInt(walletInfo.user.perfect_money_balance) >=
        parseInt(walletInfo.incominMessage.investment_amount)
      ) {
        walletInfo.user.set({
          perfect_money_balance:
            parseInt(walletInfo.user.perfect_money_balance) -
            parseInt(walletInfo.incominMessage.investment_amount),
        });
        return { error: false };
      }
      return {
        error: true,
        errMessage:
          "Insufficient PERFECT MONEY balance , please try other currency.",
      };

      break;

    case "PAYEER":
      if (
        parseInt(walletInfo.user.payer_balance) >=
        parseInt(walletInfo.incominMessage.investment_amount)
      ) {
        walletInfo.user.set({
          payer_balance:
            parseInt(walletInfo.user.payer_balance) -
            parseInt(walletInfo.incominMessage.investment_amount),
        });

        return { error: false };
      }
      return {
        error: true,
        errMessage: "Insufficient PAYEER balance , please try other currency.",
      };

      break;

    case "BNB":
      if (
        parseInt(walletInfo.user.bnb_balance) >=
        parseInt(walletInfo.incominMessage.investment_amount)
      ) {
        walletInfo.user.set({
          bnb_balance:
            parseInt(walletInfo.user.bnb_balance) -
            parseInt(walletInfo.incominMessage.investment_amount),
        });
        return { error: false };
      }
      return {
        error: true,
        errMessage: "Insufficient BNB balance , please try other currency.",
      };

      break;

    default:
      return {
        error: true,
        errMessage:
          "An unexpected error occured while trying to verify currency",
      };
      break;
  }
};

module.exports = check_wallet_balance;
