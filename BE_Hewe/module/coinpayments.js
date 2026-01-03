const Coinpayments = require("coinpayments");

// const autoIpn = false // default
// const ipnTime = true // default
// const options = {key,secret}

const client = new Coinpayments({
  key: "e3580c8f3d01cd37ed06b23990c2c89eecc1abeca9c48f7888871d8e4d1a31b3",
  secret: "2f1ff484733c709781B57adfa4d7EA9Dbdcd2807Aa71cE8fa76E322DDdF684b0",
  autoIpn: true,
});

const createWallet = (wallet) => {
  // USDT.ERC20 or USDT.TRC20 or USDT.BEP20

  console.log("client", client);

  return client.getCallbackAddress({
    currency: wallet,
  });
};

module.exports = {
  createWallet,
};
