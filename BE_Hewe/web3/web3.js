const WALLET_USER = require("../model/walletUserModel");
const coinpayments = require("../module/coinpayments");
const Web3 = require("web3");

const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

module.exports = {
  createWalletCoinpayment: async (userid, symbol, user) => {
    // tìm theo userId và symbol -> có rồi thì không tạo mới, trả về address // không có thì tạo mới
    // mỗi user có max 3 record tương đương 3 địa chỉ ví
    try {
      const wallet = await WALLET_USER.findOne({ code: symbol, userId: userid });
      if (wallet) return { flag: false, address: wallet.address };

      // tạo mới
      // nếu ERC20 hoặc TRC20 thì dùng Coinpayments
      // BEP20 thì dùng web3

      if (symbol === "USDT.ERC20" || symbol === "USDT.TRC20") {
        const data = await coinpayments.createWallet(symbol);

        await WALLET_USER.create({
          userId: userid,
          userName: user.name,
          userEmail: user.email,
          address: data.address,
          code: `${symbol}`,
          privateKey: "", // tạo bằng coinpayments không có private key để trống
        });

        return { flag: true, address: data.address };
      } else if (symbol === "USDT.BEP20") {
        const data = web3.eth.accounts.create();

        await WALLET_USER.create({
          userId: userid,
          userName: user.name,
          userEmail: user.email,
          address: data.address,
          code: `${symbol}`,
          privateKey: data.privateKey.slice(2, data.privateKey.length),
        });

        return { flag: true, address: data.address };
      }
    } catch (error) {
      console.log(error);
    }
  },
};
