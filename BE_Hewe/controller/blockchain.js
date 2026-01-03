require("dotenv").config();
const Web3 = require("web3");
const USDT = require("../contracts/USDT.json");
const HEWE = require("../contracts/HEWE.json");
const { network } = require("../constants/index");
const { decrypt } = require("../module/crypto");

const { Web3: Web3New } = require("web3new");

const rpcTestnet = `https://damp-smart-night.bsc-testnet.quiknode.pro/6dcdaaff5b9a2f8262793e1cf86bfbbc7ad11f76/`;
const rpcMainnet = `https://indulgent-convincing-crater.bsc.quiknode.pro/2aa91caa6c5f1db27fbe1d6b679ec3260220944c/`;

let rpc = network == 97 ? rpcTestnet : rpcMainnet;

const web3 = new Web3(rpc);
const web3Http = new Web3(rpc);
const web3New = new Web3New("https://node1.amchain.net/"); // này dùng để cào
const web3_v1_amchain = new Web3("https://node1.amchain.net/"); // này dùng để chuyển amc

var lastBlock = process.env.LAST_BLOCK;
const USDTInstance = new web3.eth.Contract(USDT.abi, USDT.networks[network].address);
const HEWEInstance = new web3_v1_amchain.eth.Contract(HEWE.abi, HEWE.networks[999999].address);

const { saveConfig } = require("../common/updateAttributeEnv");
const { callTransferToken } = require("../module/transferToken");
const { blockAddress } = require("../module/amchainapi");
const WALLET_USER = require("../model/walletUserModel");
const USER = require("../model/userModel");
const DEPOSIT = require("../model/depositModel");
const DEPOSIT_AMC = require("../model/depositAMCModel");
const DEPOSIT_HEWE = require("../model/depositHEWEModel");
const CONFIG_VALUE = require("../model/configValueModel");
const TX_CHART = require("../model/txChartModel");
const HOMEPAGE_SWAP = require("../model/homepageSwapTransaction");
const { writeLogTransferAMC } = require("../module/log");
const { sendTelegramMessageToChannel } = require("../module/telegram");
const transferHEWE = require("../module/transferHEWE");

const WALLET_SWAP_HOMEPAGE = "0xdF92C71f188c7b35b35F67C565EbA5e977Ce6DB8";

const getWalletPool = async (token) => {
  if (token == "USDT") {
    return (await CONFIG_VALUE.findOne({ configKey: "walletpoolUsdt" }))?.configValueString;
  } else if (token == "HEWE") {
    return (await CONFIG_VALUE.findOne({ configKey: "walletpoolHewe" }))?.configValueString;
  }
};

const getAllWalletUser = async () => {
  // lấy tất cả địa chỉ ví user đã tạo trong hệ thống
  // hiện tại chỉ lấy ví BEP20 (tạo bằng web3), các ví tạo bằng coinpayment chưa làm
  try {
    let list = await WALLET_USER.find({ code: "USDT.BEP20" });
    let listAddress = list.map((item) => item.address);
    return listAddress;
  } catch (error) {
    console.log(error);
    return [];
  }
};

async function transferBNB(fromAddress, toAddress, transferAmount, my_privkey) {
  try {
    console.log(`Attempting to make transaction from ${fromAddress} to ${toAddress}`);
    //console.log({ fromAddress, toAddress, transferAmount, my_privkey });

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toWei(`${transferAmount}`, "ether"),
        gas: "54154",
      },
      my_privkey
    );

    // console.log("sendBNB", createTransaction.rawTransaction);

    // Deploy transaction
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);

    return createReceipt;
  } catch (error) {
    console.log(error, "transferBNB");
  }
}

async function transferAMC(fromAddress, toAddress, transferAmount, my_privkey) {
  try {
    console.log(`Attempting to make transaction from ${fromAddress} to ${toAddress}`);
    //console.log({ fromAddress, toAddress, transferAmount, my_privkey });

    // QUAN TRỌNG: phải dùng web3 bản cũ v1, rpc là amchain, không cần gasPrice, maxFeePerGas, maxPriorityFeePerGas -> thì mới chuyển được

    const createTransaction = await web3_v1_amchain.eth.accounts.signTransaction(
      {
        from: fromAddress,
        to: toAddress,
        value: web3New.utils.toWei(`${transferAmount}`, "ether"),
        gas: "54154",
      },
      my_privkey
    );

    //console.log("sendAMC", createTransaction.rawTransaction);

    // Deploy transaction
    const createReceipt = await web3New.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);

    return createReceipt.transactionHash;
  } catch (error) {
    console.log(error, "transferAMC");
    writeLogTransferAMC(`${new Date().toISOString()} ${error}`);
  }
}

const processDeposit = async (userData, transaction, userWallet) => {
  // user chuyển tiền vào địa chỉ ví đã tạo trước đó bằng createWallet
  // blockchain sẽ bắt được giao dịch đó
  // userData là thông tin user nạp tiền
  // transaction là thông tin giao dịch chuyển tiền vào ví user
  try {
    let amount = transaction.returnValues.value;
    amount = web3.utils.fromWei(amount, "ether");

    if (Number(amount) < 5) return;

    // không cộng tiền ở đây // đợi tiền về ví admin rồi mới cộng
    // nhưng lưu giao dịch trước (kiểu pending)
    // lưu giao dịch
    let x = await DEPOSIT.create({
      userId: userData._id,
      userName: userData.name,
      userEmail: userData.email,
      transactionHash: transaction.transactionHash, // hash này là hash của giao dịch trên cào được từ blockchain
      category: "receiveWalletWeb3", // mấy cái cũ nạp qua coinpayment là "receive"
      coinKey: "USDT.BEP20",
      amount: Number(amount),
      address: transaction.returnValues.to, // địa chỉ ví nhận tiền
      amountBefore: userData.usdtBalance,
      amountAfter: -99, // nào cộng tiền xong thì cập nhật lại
      logData: "", // nào chuyển tiền về admin xong thì cập nhật lại
    });

    // bước tiếp theo
    // ví của admin sẽ chuyển BNB từ ví admin sang ví user để làm phí gas giao dịch
    // cập nhật 10/9/2024: check ví cá nhân user nếu có đủ 0.003 BNB thì không cần chuyển từ ví admin qua nữa (vì user đã có đủ phí gas)
    // cập nhật 10/2/2025: số BNB là 0.001
    let userBNBBalance = await web3.eth.getBalance(userWallet.address);
    userBNBBalance = web3.utils.fromWei(userBNBBalance, "ether");
    userBNBBalance = parseFloat(userBNBBalance);

    if (userBNBBalance < 0.001) {
      let TRANSFER_BNB_ADMIN_ADDRESS = (await CONFIG_VALUE.findOne({ configKey: "admin_bnb_address" }))
        ?.configValueString;
      let TRANSFER_BNB_ADMIN_PRIVATE_KEY = (await CONFIG_VALUE.findOne({ configKey: "admin_bnb_key" }))
        ?.configValueString;
      let TRANSFER_BNB_AMOUNT = Number(
        (await CONFIG_VALUE.findOne({ configKey: "admin_bnb_amount" }))?.configValueString
      );
      let transferBNBReceipt = await transferBNB(
        TRANSFER_BNB_ADMIN_ADDRESS,
        transaction.returnValues.to,
        TRANSFER_BNB_AMOUNT,
        TRANSFER_BNB_ADMIN_PRIVATE_KEY
      );

      if (transferBNBReceipt) {
        // sau đó chờ 15s để giao dịch BNB được xác nhận
        setTimeout(async () => {
          // chuyển tiền từ ví user sang ví admin
          let TRANSFER_USDT_ADMIN_ADDRESS = (await CONFIG_VALUE.findOne({ configKey: "admin_usdt_address" }))
            ?.configValueString;
          // private key của ví user

          let result = await callTransferToken(
            Number(amount),
            TRANSFER_USDT_ADMIN_ADDRESS, // địa chỉ admin nhận tiền
            transaction.returnValues.to, // địa chỉ ví user
            userWallet.privateKey
          ); // output: receipt / null

          if (result) {
            // có result là tiền đã về ví admin -> cộng tiền cho user
            // cộng tiền cho user
            await USER.updateOne({ _id: userData._id }, { $inc: { usdtBalance: Number(amount) } });

            // lấy thông tin user sau khi cộng tiền
            let userAfterUpdate = await USER.findOne({ _id: userData._id });

            await DEPOSIT.updateOne(
              { _id: x._id },
              {
                logData: JSON.stringify({
                  ...result,
                  userBNBBalance: `${userBNBBalance} need transfer`,
                }),
                amountAfter: userAfterUpdate.usdtBalance,
              }
            );
          }
        }, 15000);
      }
    } else {
      // nếu user đã có đủ 0.001 phí gas thì không cần chuyển từ ví admin qua nữa
      // chuyển tiền từ ví user sang ví admin
      let TRANSFER_USDT_ADMIN_ADDRESS = (await CONFIG_VALUE.findOne({ configKey: "admin_usdt_address" }))
        ?.configValueString;
      // private key của ví user

      let result = await callTransferToken(
        Number(amount),
        TRANSFER_USDT_ADMIN_ADDRESS, // địa chỉ admin nhận tiền
        transaction.returnValues.to, // địa chỉ ví user
        userWallet.privateKey
      ); // output: receipt / null

      if (result) {
        // có result là tiền đã về ví admin -> cộng tiền cho user
        // cộng tiền cho user
        await USER.updateOne({ _id: userData._id }, { $inc: { usdtBalance: Number(amount) } });

        // lấy thông tin user sau khi cộng tiền
        let userAfterUpdate = await USER.findOne({ _id: userData._id });

        await DEPOSIT.updateOne(
          { _id: x._id },
          {
            logData: JSON.stringify({
              ...result,
              userBNBBalance: `${userBNBBalance} already enough`,
            }),
            amountAfter: userAfterUpdate.usdtBalance,
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const depositAMC = async (userData, tx, ww) => {
  try {
    let amount = tx.value;
    amount = web3New.utils.fromWei(amount.toString(), "ether");

    if (Number(amount) < 5) return;

    // lưu giao dịch
    let x = await DEPOSIT_AMC.create({
      userId: userData._id,
      userName: userData.name,
      userEmail: userData.email,
      transactionHash: tx.hash, // hash của giao dịch trên cào được từ blockchain
      category: "receiveWalletWeb3",
      coinKey: "AMC",
      amount: Number(amount),
      address: tx.to, // địa chỉ ví nhận tiền
      amountBefore: userData.amcBalance,
      amountAfter: -99, // sau khi cộng tiền thì cập nhật lại
      logData: "", // sau khi chuyển tiền về admin thì lưu logData ở đây
    });

    console.log("Đã lưu giao dịch pending");

    // bước tiếp theo // chuyển tiền nhận được về ví admin (dùng hàm chuyển BNB)
    let ADMIN_AMC_ADDRESS = (await CONFIG_VALUE.findOne({ configKey: "admin_amc_address" }))?.configValueString;

    let amountToTransfer = Number(amount) - 0.005; // trừ phí gas
    let result = await transferAMC(
      ww.address, // địa chỉ ví user
      ADMIN_AMC_ADDRESS, // địa chỉ admin nhận tiền
      amountToTransfer,
      ww.privateKey // private key của ví user
    );

    if (result) {
      // cộng AMC cho user
      await USER.updateOne({ _id: userData._id }, { $inc: { amcBalance: Number(amount) } });

      // lấy thông tin user sau khi cộng tiền
      let userAfterUpdate = await USER.findOne({ _id: userData._id });

      // cập nhật logData
      await DEPOSIT_AMC.updateOne(
        { _id: x._id },
        {
          logData: JSON.stringify(result),
          amountAfter: userAfterUpdate.amcBalance,
        }
      );

      console.log("Đã chuyển về ví admin, cộng tiền cho user và lưu logData");
    }
  } catch (error) {
    console.log(error);
  }
};

const processDepositHewe = async (transaction) => {
  // từ transaction lấy ra người gửi
  let fromAddress = transaction.returnValues.from;

  // tìm trong user model xem có user nào có walletAddress = fromAddress không
  let user = await USER.findOne({ walletAddress: fromAddress });
  if (user) {
    // nếu tìm thấy user thì cộng hewe, lưu giao dịch
    // số hewe này cộng vào heweDeposit // lưu thành 1 số dư riêng biệt với heweBalance và không được rút ra
    // không cộng vào heweBalance

    let transactionAmount = web3.utils.fromWei(transaction.returnValues.value, "ether"); // số hewe
    await USER.updateOne({ _id: user._id }, { $inc: { heweDeposit: Number(transactionAmount) } });
    let userAfterUpdate = await USER.findOne({ _id: user._id });

    // lưu giao dịch
    let logData = {
      beforeHeweBalance: user.heweBalance,
      afterHeweBalance: userAfterUpdate.heweBalance,
      beforeHeweDeposit: user.heweDeposit,
      afterHeweDeposit: userAfterUpdate.heweDeposit,
    };
    await DEPOSIT_HEWE.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      transactionHash: transaction.transactionHash,
      fromAddress: transaction.returnValues.from,
      toAddress: transaction.returnValues.to,
      amount: Number(transactionAmount),
      logData: JSON.stringify(logData),
    });
  } else {
    // không tìm thấy user cũng lưu giao dịch lại luôn nhưng không cộng tiền
    await DEPOSIT_HEWE.create({
      transactionHash: transaction.transactionHash,
      fromAddress: transaction.returnValues.from,
      toAddress: transaction.returnValues.to,
      amount: Number(transactionAmount),
      logData: "",
    });
  }

  // khoá (restrict) cái fromAddress (fromAddress là địa chỉ ví user nạp hewe)
  await blockAddress(fromAddress);
};

const calcSwapRate = async () => {
  let poolHewe = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;
  let poolUsdt = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let price = poolUsdt / poolHewe;
  return price;
};

const calcSlippageBuy = async (amountUSDT) => {
  // lấy giá hiện tại
  let currentPrice = await calcSwapRate();

  // từ amountUSDT tính ra amountHEWE bằng giá hiện tại (đây chưa phải là amountHEWE cuối cùng)
  let amountHewe = amountUSDT / currentPrice;

  // lấy poolUsdt, poolHewe hiện tại
  let currentPoolUSDT = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let currentPoolHEWE = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;

  // ước tính số poolUSDT, poolHEWE sau khi thực hiện giao dịch
  // giao dịch mua thì poolUsdt tăng, poolHewe giảm
  let poolUsdtAfter = currentPoolUSDT + amountUSDT;
  let poolHeweAfter = currentPoolHEWE - amountHewe;

  // tính ra giá mới -> giá dự kiến sau khi thực hiện giao dịch
  let estimatedPrice = poolUsdtAfter / poolHeweAfter;

  // tính phần trăm trượt giá
  let slippage = ((currentPrice - estimatedPrice) / estimatedPrice) * 100;
  slippage = Math.abs(slippage);

  return slippage;
};

const calcSlippageSell = async (amountHEWE) => {
  // lấy giá hiện tại
  let currentPrice = await calcSwapRate();

  // từ amountHEWE tính ra amountUSDT bằng giá hiện tại (đây chưa phải là amountUSDT cuối cùng)
  let amountUSDT = amountHEWE * currentPrice;

  // lấy poolUsdt, poolHewe hiện tại
  let currentPoolUSDT = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let currentPoolHEWE = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;

  // ước tính số poolUSDT, poolHEWE sau khi thực hiện giao dịch
  // giao dịch bán thì poolUsdt giảm, poolHewe tăng
  let poolUsdtAfter = currentPoolUSDT - amountUSDT;
  let poolHeweAfter = currentPoolHEWE + amountHEWE;

  // tính ra giá mới -> giá dự kiến sau khi thực hiện giao dịch
  let estimatedPrice = poolUsdtAfter / poolHeweAfter;

  // tính phần trăm trượt giá
  let slippage = ((currentPrice - estimatedPrice) / estimatedPrice) * 100;
  slippage = Math.abs(slippage);

  return slippage;
};

const processTransactionBuy = async (transaction) => {
  console.log("Đã tìm thấy giao dịch mua", transaction);

  let transactionAmount = web3.utils.fromWei(transaction.returnValues.value, "ether"); // số usdt
  let currentPrice = await calcSwapRate();

  let slippage = await calcSlippageBuy(transactionAmount);
  if (slippage >= 30) {
    return;
  }

  let amountHewe = transactionAmount / currentPrice; // số hewe theo giá hiện tại
  let realAmountHewe = amountHewe - (amountHewe * slippage) / 100; // số hewe thực tế mà user nhận được

  // giao dịch mua thì poolUsdt tăng, poolHewe giảm -> cập nhật pool
  let poolUsdtBefore = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let poolHeweBefore = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;
  await CONFIG_VALUE.updateOne({ configKey: "poolUsdt" }, { $inc: { configValue: Number(transactionAmount) } });
  await CONFIG_VALUE.updateOne({ configKey: "poolHewe" }, { $inc: { configValue: Number(realAmountHewe) * -1 } });
  let poolUsdtAfter = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let poolHeweAfter = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;

  // lưu giao dịch
  await TX_CHART.create({
    type: "buy",
    sendAddress: transaction.returnValues.from,
    receiveAddress: transaction.returnValues.to,
    receiveToken: "USDT",
    transactionHash: transaction.transactionHash,
    amountUsdt: transactionAmount,
    amountHewe: realAmountHewe, // lưu số hewe sau khi xử lý trượt giá slippage
    price: currentPrice,
    status: "success",
    logData: JSON.stringify({
      poolUsdtBefore,
      poolHeweBefore,
      poolUsdtAfter,
      poolHeweAfter,
    }),
  });
};

const processTransactionSell = async (transaction) => {
  console.log("Đã tìm thấy giao dịch bán", transaction);

  let transactionAmount = web3.utils.fromWei(transaction.returnValues.value, "ether"); // số hewe
  let currentPrice = await calcSwapRate();

  let slippage = await calcSlippageSell(transactionAmount);
  if (slippage >= 30) {
    return;
  }

  let amountUsdt = transactionAmount * currentPrice; // số usdt theo giá hiện tại
  let realAmountUsdt = amountUsdt - (amountUsdt * slippage) / 100; // số usdt thực tế mà user nhận được

  // giao dịch bán thì poolUsdt giảm, poolHewe tăng -> cập nhật pool
  let poolUsdtBefore = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let poolHeweBefore = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;
  await CONFIG_VALUE.updateOne({ configKey: "poolUsdt" }, { $inc: { configValue: Number(realAmountUsdt) * -1 } });
  await CONFIG_VALUE.updateOne({ configKey: "poolHewe" }, { $inc: { configValue: Number(transactionAmount) } });
  let poolUsdtAfter = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let poolHeweAfter = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;

  // lưu giao dịch
  await TX_CHART.create({
    type: "sell",
    sendAddress: transaction.returnValues.from,
    receiveAddress: transaction.returnValues.to,
    receiveToken: "HEWE",
    transactionHash: transaction.transactionHash,
    amountUsdt: realAmountUsdt, // lưu số usdt sau khi xử lý trượt giá slippage
    amountHewe: transactionAmount,
    price: currentPrice,
    status: "success",
    logData: JSON.stringify({
      poolUsdtBefore,
      poolHeweBefore,
      poolUsdtAfter,
      poolHeweAfter,
    }),
  });
};

const processTransactionSwapHomepage = async (transaction) => {
  // giao dịch loại này trên web3, không cần user login, không có thông tin user, chỉ lưu giao dịch bằng địa chỉ ví
  try {
    let amount = transaction.returnValues.value;
    amount = web3.utils.fromWei(amount, "ether");

    // giới hạn tối thiểu để giao dịch được ghi nhận: 5 USDT
    if (Number(amount) < 5) return;

    // quy đổi sang AMC theo tỉ giá hiện tại
    let priceAMC = Number((await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue);
    const amountAMC = Number(amount) / priceAMC;

    // lấy address và private key để chuyển
    let address = (await CONFIG_VALUE.findOne({ configKey: "HOMEPAGE_SWAP_ADDRESS" }))?.configValueString;
    let privateKey = (await CONFIG_VALUE.findOne({ configKey: "HOMEPAGE_SWAP_PRIVATE_KEY" }))?.configValueString;
    privateKey = decrypt(privateKey);
    // chuyển AMC cho user
    let result = await transferAMC(
      address,
      transaction.returnValues.from, // địa chỉ ban đầu user chuyển USDT đến
      amountAMC,
      privateKey
    );

    if (result) {
      // chuyển thành công, lưu lịch sử là xong
      await HOMEPAGE_SWAP.create({
        fromAddress1: transaction.returnValues.from,
        toAddress1: transaction.returnValues.to,
        token1: "USDT",
        amount1: Number(amount),
        txHash1: transaction.transactionHash,
        time1: "",
        rate: priceAMC,
        token2: "AMC",
        amount2: Number(amountAMC),
        fromAddress2: address,
        toAddress2: transaction.returnValues.from,
        txHash2: result,
        status: "success",
        logData: "",
        type: "USDT(BEP20)=>AMC(AMC20)",
      });
    } else {
      // chuyển không thành công thì lưu lại để xử lý sau
      await HOMEPAGE_SWAP.create({
        fromAddress1: transaction.returnValues.from,
        toAddress1: transaction.returnValues.to,
        token1: "USDT",
        amount1: Number(amount),
        txHash1: transaction.transactionHash,
        time1: "",
        rate: priceAMC,
        token2: "AMC",
        amount2: Number(amountAMC),
        fromAddress2: address,
        toAddress2: transaction.returnValues.from,
        txHash2: "",
        status: "failed",
        logData: "",
        type: "USDT(BEP20)=>AMC(AMC20)",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const processTransactionSwapUSDTBEP20ToHEWEAMC20Homepage = async (transaction) => {
  // giao dịch loại này trên web3, không cần user login, không có thông tin user, chỉ lưu giao dịch bằng địa chỉ ví
  try {
    let amount = transaction.returnValues.value;
    amount = web3.utils.fromWei(amount, "ether");

    // giới hạn tối thiểu để giao dịch được ghi nhận: 5 USDT
    if (Number(amount) < 5) return;

    // quy đổi sang Hewe theo tỉ giá hiện tại
    let priceHewe = Number((await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue);
    const amountHewe = Number(amount) / priceHewe;

    // lấy address và private key để chuyển
    let address = (await CONFIG_VALUE.findOne({ configKey: "HOMEPAGE_SWAP_ADDRESS" }))?.configValueString;
    let privateKey = (await CONFIG_VALUE.findOne({ configKey: "HOMEPAGE_SWAP_PRIVATE_KEY" }))?.configValueString;
    privateKey = decrypt(privateKey);
    // chuyển Hewe cho user
    // amount, addressRevecied, myAddress, privateKeyMyAddress
    let result = await transferHEWE(
      amountHewe,
      transaction.returnValues.from, // địa chỉ ban đầu user chuyển USDT đến
      address,
      privateKey
    );

    if (result) {
      // chuyển thành công, lưu lịch sử là xong
      await HOMEPAGE_SWAP.create({
        fromAddress1: transaction.returnValues.from,
        toAddress1: transaction.returnValues.to,
        token1: "USDT",
        amount1: Number(amount),
        txHash1: transaction.transactionHash,
        time1: "",
        rate: priceHewe,
        token2: "HEWE",
        amount2: Number(amountHewe),
        fromAddress2: address,
        toAddress2: transaction.returnValues.from,
        txHash2: result,
        status: "success",
        logData: "",
        type: "USDT(BEP20)=>HEWE(AMC20)",
      });
    } else {
      // chuyển không thành công thì lưu lại để xử lý sau
      await HOMEPAGE_SWAP.create({
        fromAddress1: transaction.returnValues.from,
        toAddress1: transaction.returnValues.to,
        token1: "USDT",
        amount1: Number(amount),
        txHash1: transaction.transactionHash,
        time1: "",
        rate: priceHewe,
        token2: "HEWE",
        amount2: Number(amountHewe),
        fromAddress2: address,
        toAddress2: transaction.returnValues.from,
        txHash2: "",
        status: "failed",
        logData: "",
        type: "USDT(BEP20)=>HEWE(AMC20)",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const processTransactionSwapHomepageTypeAMC = async (tx) => {
  try {
    let amount = tx.value;
    amount = web3New.utils.fromWei(amount.toString(), "ether");

    // giới hạn tối thiểu để giao dịch được ghi nhận: 10 AMC
    if (Number(amount) < 10) return;

    // cào được giao dịch thì lưu db là xong, admin tự xử lý phần còn lại của việc swap
    await HOMEPAGE_SWAP.create({
      fromAddress1: tx.from,
      toAddress1: tx.to,
      token1: "AMC",
      amount1: Number(amount),
      txHash1: tx.hash,
      time1: "",
      rate: 0, // không quy đổi
      token2: "AMC",
      amount2: 0, // không tính
      fromAddress2: "",
      toAddress2: "",
      txHash2: "",
      status: "pending",
      logData: "",
      type: "AMC(AMC20)=>AMC(BEP20)",
    });

    // cập nhật 29/5/2025: gửi telegram thông báo giao dịch
    await sendTelegramMessageToChannel(
      `Swap AMC (AMC20) - AMC (BEP20)\nFrom: ${tx.from}\nAmount AMC: ${Number(amount)}`
    );
  } catch (error) {
    console.log(error);
  }
};

async function getEventContract() {
  var toBlock = Number(await web3Http.eth.getBlockNumber());
  if (toBlock - lastBlock > 10) {
    toBlock = lastBlock * 1 + 10;
  }

  console.log("HEWE IO block", lastBlock, toBlock);

  if (toBlock < lastBlock) return;

  USDTInstance.getPastEvents(`Transfer`, { fromBlock: lastBlock, toBlock: toBlock }, async (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      // console.log(result, "Transfer"); // result là một mảng các giao dịch transfer cào được trong khoảng [lastBlock, toBlock]

      if (result.length) {
        setTimeout(async () => {
          // lấy mảng các địa chỉ ví user hewe
          let listAddress = await getAllWalletUser();

          let WALLET_POOL_USDT = await getWalletPool("USDT");

          // xét từng giao dịch trong mảng result // nếu giao dịch có to tìm thấy trong listAddress thì đó là giao dịch của user hewe
          for (let transaction of result) {
            let toAddress = transaction.returnValues.to;

            if (listAddress.includes(toAddress)) {
              // tìm user sở hữu toAddress
              let ww = await WALLET_USER.findOne({ address: toAddress });
              if (ww) {
                let userId = ww.userId;
                let userData = await USER.findOne({ _id: userId });

                await processDeposit(userData, transaction, ww);
              }
            }

            if (toAddress.toLowerCase() == WALLET_POOL_USDT.toLowerCase()) {
              // nếu địa chỉ nhận tiền là WALLET_POOL_USDT -> đây là giao dịch mua -> dùng USDT để mua HEWE
              await processTransactionBuy(transaction);
            }

            if (toAddress.toLowerCase() == WALLET_SWAP_HOMEPAGE.toLowerCase()) {
              // nếu địa chỉ nhận tiền là WALLET_SWAP_HOMEPAGE -> đây là giao dịch swap trên trang chủ (mới 5/2025)
              await processTransactionSwapHomepage(transaction);
            }
          }
        }, 5000);
      }
    }
  });

  lastBlock = toBlock + 1;
  saveConfig(lastBlock);
}

async function getBlockss() {
  var toBlock = Number(await web3New.eth.getBlockNumber());
  console.log("🚀 ~ getBlockss ~ toBlock:", toBlock);
  let fromBlock = (await CONFIG_VALUE.findOne({ configKey: "from_block_amchain" }))?.configValue;
  fromBlock = Number(fromBlock);
  if (toBlock - fromBlock > 5) {
    toBlock = fromBlock * 1 + 5;
  }

  console.log("HEWE amchain", fromBlock, toBlock);

  if (toBlock < fromBlock) return;

  let WALLET_POOL_HEWE = await getWalletPool("HEWE");
  let receiveHeweDeposit = (await CONFIG_VALUE.findOne({ configKey: "receiveHeweDeposit" }))?.configValueString;

  // cào bằng web3New
  let listAddress = await getAllWalletUser();
  let listAddressLowerCase = listAddress.map((item) => item.toLowerCase());

  for (let i = fromBlock; i <= toBlock; i++) {
    const block = await web3New.eth.getBlock(i, true);
    if (block && block.transactions) {
      for (let tx of block.transactions) {
        if (listAddressLowerCase.includes(tx.to?.toLowerCase())) {
          console.log("Đã tìm thấy giao dịch", tx);

          let ww = await WALLET_USER.findOne({
            address: {
              $regex: tx.to,
              $options: "i",
            },
          });
          if (ww) {
            let userId = ww.userId;
            let userData = await USER.findOne({ _id: userId });

            await depositAMC(userData, tx, ww);
          }
        }

        // nếu địa chỉ nhận là WALLET_SWAP_HOMEPAGE -> giao dịch này là giao dịch swap trên trang chủ
        // là user quét mã QR chuyển AMC (native coin của mạng AMC20) sang ví WALLET_SWAP_HOMEPAGE
        // cào được giao dịch thì lưu db là xong, admin tự xử lý phần còn lại của việc swap
        if (tx.to?.toLowerCase() == WALLET_SWAP_HOMEPAGE.toLowerCase()) {
          await processTransactionSwapHomepageTypeAMC(tx);
        }
      }
    }
  }

  HEWEInstance.getPastEvents(`Transfer`, { fromBlock: fromBlock, toBlock: toBlock }, async (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      if (result.length) {
        for (let transaction of result) {
          if (transaction.returnValues.to?.toLowerCase() == WALLET_POOL_HEWE.toLowerCase()) {
            // nếu địa chỉ nhận tiền là WALLET_POOL_HEWE -> đây là giao dịch bán -> bán HEWE để nhận USDT
            await processTransactionSell(transaction);
          }

          if (transaction.returnValues.to?.toLowerCase() == receiveHeweDeposit.toLowerCase()) {
            // nếu địa chỉ nhận tiền là receiveHeweDeposit -> đây là giao dịch nạp hewe
            console.log("Đã tìm thấy giao dịch nạp hewe", transaction);

            await processDepositHewe(transaction);
          }
        }
      }
    }
  });

  fromBlock = toBlock + 1;
  await CONFIG_VALUE.updateOne({ configKey: "from_block_amchain" }, { configValue: fromBlock });
}

async function getEventContractOnlyOneBlock() {
  // để cào lại 1 block bị thiếu thôi
  USDTInstance.getPastEvents(`Transfer`, { fromBlock: 41325427, toBlock: 41325427 }, async (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      if (result.length) {
        setTimeout(async () => {
          // lấy mảng các địa chỉ ví user hewe
          let listAddress = await getAllWalletUser();

          // xét từng giao dịch trong mảng result // nếu giao dịch có to tìm thấy trong listAddress thì đó là giao dịch của user hewe
          for (let transaction of result) {
            let toAddress = transaction.returnValues.to;
            if (listAddress.includes(toAddress)) {
              // tìm user sở hữu toAddress
              let ww = await WALLET_USER.findOne({ address: toAddress });
              if (ww) {
                let userId = ww.userId;
                let userData = await USER.findOne({ _id: userId });

                console.log("userData", userData);

                await processDeposit(userData, transaction, ww);
              }
            }
          }
        }, 5000);
      }
    }
  });
}

async function initGetCurrentBlockBEP20() {
  try {
    let latestBlock = Number(await web3Http.eth.getBlockNumber());
    console.log("🚀 ~ initGetCurrentBlockBEP20 ~ latestBlock:", latestBlock);
    // await saveConfigToDatabase(latestBlock);
    saveConfig(latestBlock);
  } catch (error) { }
}

async function getEventContractOnlyOneBlock2025(blockNumber) {
  // để cào lại 1 block bị thiếu (cho chức năng swap trên trang chủ)
  USDTInstance.getPastEvents(`Transfer`, { fromBlock: blockNumber, toBlock: blockNumber }, async (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      if (result.length) {
        setTimeout(async () => {
          for (let transaction of result) {
            let toAddress = transaction.returnValues.to;

            if (toAddress.toLowerCase() == WALLET_SWAP_HOMEPAGE.toLowerCase()) {
              // nếu địa chỉ nhận tiền là WALLET_SWAP_HOMEPAGE -> đây là giao dịch swap trên trang chủ (mới 5/2025)
              await processTransactionSwapHomepage(transaction);
            }
            if (toAddress == `0x9C845DE6E2dc359da3A22bCe0c29fA4443714A15`) {
              await processTransactionSwapUSDTBEP20ToHEWEAMC20Homepage(transaction)
            }
          }
        }, 5000);
      }
    }
  });
}

module.exports = {
  getEventContract,
  getBlockss,
  getEventContractOnlyOneBlock,
  initGetCurrentBlockBEP20,
  getEventContractOnlyOneBlock2025,
};