require("dotenv").config();
const USER = require("../../model/userModel");
const REFERRAL = require("../../model/referralModel");
const SESSION = require("../../model/sessionModel");
const CONFIG_VALUE = require("../../model/configValueModel");
const SWAP_TRANSACTION_HISTORY = require("../../model/swapTransactionHistoryModel");
const BUY_TRANSACTION_HISTORY = require("../../model/buyTransactionHistoryModel");
const BANK = require("../../model/bankModel");
const WITHDRAW = require("../../model/withdrawModel");
const WITHDRAW_HEWE = require("../../model/withdrawHeweModel");
const WITHDRAW_AMC = require("../../model/withdrawAmcModel");
const WALLET_USER = require("../../model/walletUserModel");
const DEPOSIT = require("../../model/depositModel");
const DEPOSIT_AMC = require("../../model/depositAMCModel");
const DEPOSIT_HEWE = require("../../model/depositHEWEModel");
const CONTACT = require("../../model/contactUsModel");
const BUY_PACKAGE_BY_USDT = require("../../model/buyPackageByUsdtModel");
const BUY_PACKAGE_BY_CONNECT_WALLET = require("../../model/buyPackageByConnectWalletModel");
const BUY_TOKEN_V2 = require("../../model/buyTokenV2Model");
const COMMISSION_V2 = require("../../model/commissionV2Model");
const TRANSACTION_OLD = require("../../model/TransactionHistoryModel");
const TRANSACTION_HEWEDB = require("../../model/transactionDbModel");
const COMMISSION = require("../../model/commissionModel");
const HISTORY_UPDATE_WALLET = require("../../model/historyUpdateWallet");
const AM = require("../../model/accessModuleModel");
const ADMIN = require("../../model/adminModel");
const error = require("../../utils/error");
const { error_400, success, error_500, error_400_delRedis } = require("../../utils/error");
const bcrypt = require("bcrypt");
const salt = 10;
const JWT = require("jsonwebtoken");
const { SendOTPMail } = require("../../utils/sendMail");
const { SendContactEmailToAdmin } = require("../../utils/sendMail");
const { matchedData } = require("express-validator");
const { createWalletCoinpayment } = require("../../web3/web3");
const { getListPackage } = require("../../data/listPackage");
const {
  addCommission,
  updateLevelWhenBuyPackage,
  addCommissionV2,
  addRevenue,
  addCommissionV2_extendHeweDB,
} = require("../../utils/addCommission");
const uuid = require("uuid");
const { sendTelegramMessageToChannel } = require("../../module/telegram");
const { getPriceFromAPI } = require("../../module/socketXT");
const { getEventContractOnlyOneBlock } = require("../blockchain");
const { transferAMC } = require("../../module/transferAMC");
const { transferHEWE } = require("../../module/transferHEWE");
const { unblockAddress } = require("../../module/amchainapi");
const { getDataConfigValueFn } = require("../../module/getDataConfigValue");
const { delRedis } = require("../../database/model.redis");

const getRateAndFeeSwap = async () => {
  try {
    const rate = await CONFIG_VALUE.findOne({ configKey: "rateHEWE_USDT" });
    const fee = await CONFIG_VALUE.findOne({ configKey: "feeSwap" });

    return {
      rate: rate.configValue,
      fee: fee.configValue,
    };
  } catch (error) {
    console.log(error);
    return {
      rate: null,
      fee: null,
    };
  }
};

exports.createWallet = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    const { symbol } = matchedData(req);

    const result = await createWalletCoinpayment(userId, symbol, userData);
    if (!result.flag) return success(res, `Wallet existed`, result);

    success(res, "Wallet created successfully", result);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userData = req.user;
    userData.password = undefined;

    // lấy list package
    const listPackage = getListPackage();
    userData.listPackage = listPackage;

    success(res, "OK", { userData, listPackage });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getSwapConfig = async (req, res) => {
  try {
    const result = await getRateAndFeeSwap();
    if (result.rate == null || result.fee == null) return error_400(res, "Config not found");

    success(res, "OK", {
      canSwap: true,
      message: "",
      rate: result.rate,
      fee: result.fee,
    });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.swap = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { amountUSDT } = matchedData(req);

    // check balance USDT
    console.log(userData.usdtBalance);
    if (userData.usdtBalance < amountUSDT) return error_400(res, "Insufficient balance");

    // get rate and fee
    const result = await getRateAndFeeSwap();
    if (result.rate == null || result.fee == null) return error_400(res, "Config not found");

    // nếu có phí thì trừ phí ra khỏi amountUSDT, sau đó tính số hewe nhận được dựa trên số USDT còn lại
    // VD: amountUSDT = 100, fee = 1, amountRemain = 100 - 1 = 99
    const fee = result.fee;
    const rate = result.rate;
    // tỉ giá này là 1 HEWE = {rate} USDT // VD: tỉ giá 0.5 nghĩa là 1 HEWE = 0.5 USDT
    const amountRemain = amountUSDT - fee;
    const amountHEWE = amountRemain / rate;

    // update database trừ USDT và cộng HEWE
    await USER.updateOne(
      { _id: userId },
      {
        $inc: { usdtBalance: amountUSDT * -1, heweBalance: amountHEWE },
      }
    );

    // get user after update
    const userAfterUpdate = await USER.findOne({ _id: userId });

    // lưu lịch sử giao dịch
    const logData = {
      before: {
        usdt: userData.usdtBalance,
        hewe: userData.heweBalance,
      },
      after: {
        usdt: userAfterUpdate.usdtBalance,
        hewe: userAfterUpdate.heweBalance,
      },
    };
    const databaseData = {
      userId,
      userName: userData.name,
      userEmail: userData.email,
      amountFrom: amountUSDT,
      amountTo: amountHEWE,
      rate,
      fee,
      timestamp: Date.now().toString(),
      logData: JSON.stringify(logData),
    };

    await SWAP_TRANSACTION_HISTORY.create(databaseData);

    success(res, "Swap successfully", databaseData);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getSwapHistory = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await SWAP_TRANSACTION_HISTORY.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    const total = await SWAP_TRANSACTION_HISTORY.find({
      userId,
    }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.buyHeweByVND = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    const { idBank, amountHEWE } = matchedData(req);

    // check if bank exists and get bank data
    const bankData = await BANK.findOne({ _id: idBank });
    if (!bankData) return error_400(res, "This bank is not supported");

    // check xem user có giao dịch nào đang pending hoặc userConfirmed không (tương tự như api checkTransaction) để chặn tạo giao dịch mới khi chưa hoàn thành giao dịch cũ
    const currentTransactionData = await BUY_TRANSACTION_HISTORY.findOne({
      userId,
      status: { $in: ["pending", "userConfirmed"] },
    });
    if (currentTransactionData) return error_400(res, "Please complete your current transaction first", 1);

    // lấy tỉ giá HEWE_VND // VD: 1 HEWE = 15 đồng
    const result = await CONFIG_VALUE.findOne({ configKey: "rateHEWE_VND" });
    const rate = result.configValue;

    // nhân lên để tính số tiền VND cần chuyển
    const amountVND = amountHEWE * rate;

    // random a message: string of 8 digits characters
    const message = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;

    const databaseData = {
      userId,
      userName: userData.name,
      userEmail: userData.email,
      amountHewe: amountHEWE,
      rate,
      amountVnd: amountVND,
      bankId: idBank,
      bankData: JSON.stringify(bankData),
      timestamp: Date.now().toString(),
      message,
    };
    await BUY_TRANSACTION_HISTORY.create(databaseData);

    success(res, "OK", databaseData);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.checkTransactionBeforeUpload = async (req, res, next) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    // check giao dịch
    const { transactionId } = matchedData(req);
    const transactionData = await BUY_TRANSACTION_HISTORY.findOne({
      _id: transactionId,
      userId,
      status: "pending",
    });
    if (!transactionData) return error_400(res, "Transaction not found");

    // giao dịch hợp lệ thì lấy transactionData cho bước tiếp theo
    req.transactionData = transactionData;
    next();
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.confirmBuyHeweByVND = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;

    // đến controller này là check giao dịch rồi
    const transactionData = req.transactionData;
    const transactionId = transactionData._id;

    // kiểm tra hình ảnh tải lên
    const uploadedImage = req.uploadedImage;
    if (!uploadedImage) return error_400(res, "Please upload transfer bill image");

    // update status transaction
    await BUY_TRANSACTION_HISTORY.updateOne(
      { _id: transactionId },
      {
        $set: {
          status: "userConfirmed",
          billImage: uploadedImage.url,
          timeUserConfirmed: new Date(),
        },
      }
    );

    success(res, "Transaction confirmed successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.cancelBuyHeweByVND = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    // check giao dịch
    const { transactionId } = matchedData(req);
    const transactionData = await BUY_TRANSACTION_HISTORY.findOne({
      _id: transactionId,
      userId,
      status: "pending",
    });
    if (!transactionData) return error_400(res, "Transaction not found");

    // update status transaction
    await BUY_TRANSACTION_HISTORY.updateOne(
      { _id: transactionId },
      {
        $set: { status: "userCanceled", timeUserCanceled: new Date() },
      }
    );

    success(res, "Transaction canceled", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.checkTransaction = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    // check xem user có giao dịch nào đang: pending hoặc userConfirmed không
    const transactionData = await BUY_TRANSACTION_HISTORY.findOne({
      userId,
      status: { $in: ["pending", "userConfirmed"] },
    });

    // tìm thấy thì trả về thông tin giao dịch đó -> không được phép tạo giao dịch mới nữa
    // không tìm thấy thì trả về null -> được phép tạo giao dịch mới

    if (transactionData) {
      success(res, "Transaction found", transactionData);
    } else {
      success(res, "No pending transaction found", null);
    }
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getBuyHeweByVNDHistory = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await BUY_TRANSACTION_HISTORY.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    const total = await BUY_TRANSACTION_HISTORY.find({
      userId,
    }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getBankList = async (req, res) => {
  try {
    // const userData = req.user;
    // const userId = userData._id;
    // if (!userData || !userData || !userId) return error_400(res, "User not found");

    const data = await BANK.find().sort({ createdAt: -1 });
    success(res, "OK", data);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.withdrawUSDT = async (req, res) => {
  // rút có phí là 1
  // VD: yêu cầu rút 100 thì validate 100 bị trừ 100, nhưng admin chỉ chuyển 99
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    const { method, address, amount } = matchedData(req);

    // check balance USDT
    if (userData.usdtBalance < amount) return error_400(res, "Insufficient balance USDT");

    // subtract USDT balance
    await USER.updateOne({ _id: userId }, { $inc: { usdtBalance: amount * -1 } });

    // fetch user after update
    const userAfterUpdate = await USER.findOne({ _id: userId });
    const logData = {
      before: {
        usdt: userData.usdtBalance,
        hewe: userData.heweBalance,
      },
      after: {
        usdt: userAfterUpdate.usdtBalance,
        hewe: userAfterUpdate.heweBalance,
      },
    };

    // create withdraw record // WITHDRAW: withdraw usdt // phân biệt với WITHDRAW_HEWE: withdraw hewe
    await WITHDRAW.create({
      userId,
      userName: userData.name,
      userEmail: userData.email,
      method,
      address,
      amount,
      amountReceive: amount - 1, // admin chỉ chuyển 99
      timestamp: Date.now().toString(),
      logData: JSON.stringify(logData),
    });

    // send telegram channel
    await sendTelegramMessageToChannel(
      `Withdraw USDT\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}`
    );

    success(res, "Request to withdraw USDT successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getWithdrawUSDTHistory = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await WITHDRAW.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    const total = await WITHDRAW.find({ userId }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.withdrawHEWE = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    const { method, address, amount } = matchedData(req);

    // check balance HEWE
    if (userData.heweBalance < amount) return error_400(res, "Insufficient balance HEWE");

    // subtract HEWE balance
    await USER.updateOne({ _id: userId }, { $inc: { heweBalance: amount * -1 } });

    // fetch user after update
    const userAfterUpdate = await USER.findOne({ _id: userId });
    const logData = {
      before: {
        usdt: userData.usdtBalance,
        hewe: userData.heweBalance,
      },
      after: {
        usdt: userAfterUpdate.usdtBalance,
        hewe: userAfterUpdate.heweBalance,
      },
    };

    // lấy giá HEWE
    const HEWE_RATE = (await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue;
    const equivalentUSDT = amount * HEWE_RATE;

    if (equivalentUSDT <= 100) {
      // nếu ít hơn 100 USDT thì rút tự động

      let ENV_TRANSFER_HEWE_ADDRESS = await getDataConfigValueFn("ENV_TRANSFER_HEWE_ADDRESS");
      let ENV_TRANSFER_HEWE_PRIVATE_KEY = await getDataConfigValueFn("ENV_TRANSFER_HEWE_PRIVATE_KEY");
      let resultTransfer = await transferHEWE(
        amount,
        address,
        ENV_TRANSFER_HEWE_ADDRESS,
        ENV_TRANSFER_HEWE_PRIVATE_KEY
      );

      if (resultTransfer) {
        // trường hợp này giống như admin duyệt thành công
        // create withdraw hewe record
        await WITHDRAW_HEWE.create({
          userId,
          userName: userData.name,
          userEmail: userData.email,
          method,
          address,
          amount,
          timestamp: Date.now().toString(),
          logData: JSON.stringify(logData),
          status: "approved",
          transactionHash: resultTransfer?.transactionHash,
          timeAdminApproved: new Date(),
          adminLogData: JSON.stringify({
            typeTransfer: "auto",
          }),
          isAuto: true,
        });

        // send telegram channel
        await sendTelegramMessageToChannel(
          `Withdraw HEWE\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}\n✅ Auto transfered successfully`
        );

        success(res, "Withdraw HEWE successfully", true);
      } else {
        // gửi tự động không thành công thì cho admin duyệt như ban đầu
        // create withdraw hewe record
        await WITHDRAW_HEWE.create({
          userId,
          userName: userData.name,
          userEmail: userData.email,
          method,
          address,
          amount,
          timestamp: Date.now().toString(),
          logData: JSON.stringify(logData),
        });

        // send telegram channel
        await sendTelegramMessageToChannel(
          `Withdraw HEWE\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}`
        );

        success(res, "Request to withdraw HEWE successfully", true);
      }
    } else {
      // nếu nhiều hơn 100 USDT thì cho admin duyệt như bình thường

      // create withdraw hewe record
      await WITHDRAW_HEWE.create({
        userId,
        userName: userData.name,
        userEmail: userData.email,
        method,
        address,
        amount,
        timestamp: Date.now().toString(),
        logData: JSON.stringify(logData),
      });

      // send telegram channel
      await sendTelegramMessageToChannel(
        `Withdraw HEWE\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}`
      );

      success(res, "Request to withdraw HEWE successfully", true);
    }
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getWithdrawHeweHistory = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await WITHDRAW_HEWE.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    const total = await WITHDRAW_HEWE.find({ userId }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.withdrawAMC = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    const { method, address, amount } = matchedData(req);

    // check balance AMC
    if (userData.amcBalance < amount) return error_400(res, "Insufficient balance AMC");

    // subtract AMC balance
    await USER.updateOne({ _id: userId }, { $inc: { amcBalance: amount * -1 } });

    // fetch user after update
    const userAfterUpdate = await USER.findOne({ _id: userId });
    const logData = {
      before: {
        usdt: userData.usdtBalance,
        hewe: userData.heweBalance,
        amc: userData.amcBalance,
      },
      after: {
        usdt: userAfterUpdate.usdtBalance,
        hewe: userAfterUpdate.heweBalance,
        amc: userAfterUpdate.amcBalance,
      },
    };

    // lấy giá AMC
    const AMC_RATE = (await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue;
    const equivalentUSDT = amount * AMC_RATE;

    if (equivalentUSDT <= 100) {
      // nếu ít hơn 100 USDT thì rút tự động
      let ENV_TRANSFER_AMC_ADDRESS = await getDataConfigValueFn("ENV_TRANSFER_AMC_ADDRESS");
      let ENV_TRANSFER_AMC_PRIVATE_KEY = await getDataConfigValueFn("ENV_TRANSFER_AMC_PRIVATE_KEY");
      let resultTransfer = await transferAMC(ENV_TRANSFER_AMC_ADDRESS, address, amount, ENV_TRANSFER_AMC_PRIVATE_KEY);

      if (resultTransfer) {
        // create withdraw AMC record // trường hợp này giống như admin duyệt thành công
        await WITHDRAW_AMC.create({
          userId,
          userName: userData.name,
          userEmail: userData.email,
          method,
          address,
          amount,
          timestamp: Date.now().toString(),
          logData: JSON.stringify(logData),
          status: "approved",
          transactionHash: resultTransfer,
          timeAdminApproved: new Date(),
          adminLogData: JSON.stringify({
            typeTransfer: "auto",
          }),
          isAuto: true,
        });

        // send telegram channel
        await sendTelegramMessageToChannel(
          `Withdraw AMC\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}\n✅ Auto transfered successfully`
        );

        success(res, "Withdraw AMC successfully", true);
      } else {
        // gửi tự động không thành công thì cho admin duyệt như ban đầu
        // create withdraw AMC record
        await WITHDRAW_AMC.create({
          userId,
          userName: userData.name,
          userEmail: userData.email,
          method,
          address,
          amount,
          timestamp: Date.now().toString(),
          logData: JSON.stringify(logData),
        });

        // send telegram channel
        await sendTelegramMessageToChannel(
          `Withdraw AMC\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}`
        );

        success(res, "Request to withdraw AMC successfully", true);
      }
    } else {
      // nếu nhiều hơn 100 USDT thì cho admin duyệt như bình thường

      // create withdraw AMC record
      await WITHDRAW_AMC.create({
        userId,
        userName: userData.name,
        userEmail: userData.email,
        method,
        address,
        amount,
        timestamp: Date.now().toString(),
        logData: JSON.stringify(logData),
      });

      // send telegram channel
      await sendTelegramMessageToChannel(
        `Withdraw AMC\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}`
      );

      success(res, "Request to withdraw AMC successfully", true);
    }
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getWithdrawAmcHistory = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await WITHDRAW_AMC.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await WITHDRAW_AMC.find({ userId }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.updateUSDTBalance = async (req, res) => {
  try {
    let { address, txn_id, currency, amount } = matchedData(req);

    // tìm xem địa chỉ ví có tồn tại trong collection walletusers không, nếu có thì thuộc về user nào
    const check = await WALLET_USER.findOne({ address });
    if (!check) return error_400(res, "Wallet address not found");

    const userId = check.userId; // chủ sở hữu ví

    // tìm trong collection deposit, nếu giao dịch với txn_id chưa được ghi nhận thì lưu lịch sử và cộng amount cho user
    // nếu có txn_id rồi thì return error giao dịch đã được xử lý

    const x = await DEPOSIT.findOne({ transactionHash: txn_id });
    if (x) return error_400(res, "txn_id existed");

    // lấy thông tin user trước khi update
    const userBeforeUpdate = await USER.findOne({ _id: userId });

    // cộng amount vào balance usdt của user
    amount = parseFloat(amount);
    await USER.updateOne({ _id: userId }, { $inc: { usdtBalance: amount } });

    // lấy thông tin user sau khi update
    const userAfterUpdate = await USER.findOne({ _id: userId });

    // lưu lịch sử giao dịch
    await DEPOSIT.create({
      userId,
      userName: userBeforeUpdate.name,
      userEmail: userBeforeUpdate.email,
      transactionHash: txn_id,
      category: "receive",
      coinKey: currency,
      amount,
      address,
      amountBefore: userBeforeUpdate.usdtBalance,
      amountAfter: userAfterUpdate.usdtBalance,
      logData: JSON.stringify({}), // những data khác của giao dịch
    });

    success(res, "Update USDT balance successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDepositHistory = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await DEPOSIT.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    const total = await DEPOSIT.find({ userId }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDepositAMCHistory = async (req, res) => {
  // lịch sử nạp AMC
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    let condition = { userId };
    const startIndex = (page - 1) * limit;
    const data = await DEPOSIT_AMC.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await DEPOSIT_AMC.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDepositHEWEHistory = async (req, res) => {
  // lịch sử nạp HEWE của user
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    let condition = { userId };
    const startIndex = (page - 1) * limit;
    const data = await DEPOSIT_HEWE.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await DEPOSIT_HEWE.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.addDataToDatabase = async (req, res) => {
  try {
    const newModule = "Swap 2025";
    const existedData = await AM.findOne({ access_module: newModule });
    if (existedData) return error_400(res, "Module existed");
    // chưa có thì thêm vào
    let x = await AM.create({ access_module: newModule });
    // thêm vào cho admin
    await ADMIN.updateOne(
      {
        email: "movado68@yahoo.com",
      },
      {
        $push: { access_module: x._id },
      }
    );
    success(res, "Đã thêm " + newModule, true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.addDataToDatabaseReve = async (req, res) => {
  try {
    // duyệt qua từng record trong bảng hoa hồng (chỉ tính từ ngày 3/7 trở về sau)
    // cập nhật doanh thu F1: mỗi record, người nhận hoa hồng sẽ được cộng revenueF1 bằng số amountUSDTBuy

    const listCommission = await COMMISSION_V2.find({});
    for (let com of listCommission) {
      let commissionUserId = com.commissionUserId; // id của người nhận hoa hồng
      await USER.updateOne(
        {
          _id: commissionUserId,
        },
        {
          $inc: { revenueF1: com.amountUSDTBuy },
        }
      );
    }

    success(res, "OK F1", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.buyPackageHeweByUSDT = async (req, res) => {
  // mua HEWE bằng USDT theo gói // không mua lẻ, có bonus, có hoa hồng
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { packageName } = matchedData(req);

    // lấy data gói
    const listPackage = getListPackage();
    const packageData = listPackage.find((item) => item.name === packageName);
    if (!packageData) return error_400(res, "Package not found");

    // check balance USDT
    if (userData.usdtBalance < packageData.amountUSD) return error_400(res, "Insufficient balance USDT");

    // update database trừ USDT và cộng HEWE
    // nếu gói mua có bonus thì cộng thêm bonus
    let amountBonus = packageData.isBonus === true ? packageData.amountBonus : 0;
    await USER.updateOne(
      { _id: userId },
      {
        $inc: {
          usdtBalance: packageData.amountUSD * -1,
          heweBalance: packageData.amountHEWE + amountBonus,
        },
      }
    );

    // get user after update
    const userAfterUpdate = await USER.findOne({ _id: userId });

    // lưu lịch sử giao dịch
    const logData = {
      before: {
        usdt: userData.usdtBalance,
        hewe: userData.heweBalance,
      },
      after: {
        usdt: userAfterUpdate.usdtBalance,
        hewe: userAfterUpdate.heweBalance,
      },
    };
    let x = await BUY_PACKAGE_BY_USDT.create({
      userId,
      userName: userData.name,
      userEmail: userData.email,
      packageName,
      packageData: JSON.stringify(packageData),
      amountUSDT: packageData.amountUSD,
      amountHewe: packageData.amountHEWE,
      amountBonus: amountBonus,
      timestamp: Date.now().toString(),
      logData: JSON.stringify(logData),
    });

    // cập nhật level cho user thực hiện giao dịch
    await updateLevelWhenBuyPackage(userId, userData, packageData);

    // chạy hoa hồng cho người giới thiệu
    await addCommission(userId, userData, x, packageData.amountUSD, packageData.amountHEWE);

    success(res, "Buy HEWE successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getHistoryBuyPackageHeweByUSDT = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await BUY_PACKAGE_BY_USDT.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await BUY_PACKAGE_BY_USDT.find({ userId }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.updateWalletAddressUser = async (req, res) => {
  // api cập nhật walletAddress cho mỗi user (trong collection USER)
  // nếu user đã có walletAddress thì không được cập nhật nữa
  // chưa có thì được cập nhật 1 lần duy nhất // lưu lại thời gian cập nhật
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    // if (userData.walletAddress) return error_400(res, "Wallet address already existed"); // user update rồi vẫn được update lại

    let { address } = matchedData(req);

    // check: nếu address đã tồn tại trong database thì báo lỗi
    const check = await USER.findOne({ walletAddress: address });
    if (check) return error_400(res, "This address is already used");

    await USER.updateOne({ _id: userId }, { $set: { walletAddress: address, timeWalletAddress: new Date() } });

    // lưu lịch sử
    await HISTORY_UPDATE_WALLET.create({
      userId,
      userName: userData.name,
      userEmail: userData.email,
      oldAddress: userData.walletAddress || "",
      newAddress: address,
    });

    success(res, "Address updated successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getCommissionHistoryUser = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await COMMISSION.find({ commissionUserId: userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    const total = await COMMISSION.find({
      commissionUserId: userId,
    }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.buyPackageConnectWallet = async (req, res) => {
  // khi user mua gói bằng cách kết nối ví // bên thứ 3 sẽ gọi api này // nhận vào address và amount // lưu lại giao dịch và cộng hoa hồng
  try {
    let { address, amount, transactionHash } = matchedData(req);
    // address là địa chỉ ví user connect khi mua
    // amount là số USDT của gói mua
    // transactionHash là mã giao dịch // kiểm tra trong database có chưa, nếu có rồi thì không xử lý giao dịch đó nữa

    const check = await BUY_PACKAGE_BY_CONNECT_WALLET.findOne({
      transactionHash,
    });
    if (check) return error_400(res, "Transaction existed");

    // từ địa chỉ tìm ra thông tin user
    const user = await USER.findOne({ walletAddress: address });
    if (!user) return error_400(res, "Address not found");

    // tìm gói tương ứng với amount
    const listPackage = getListPackage();
    amount = Number(amount);
    const packageData = listPackage.find((item) => item.amountUSD === amount);
    if (!packageData) return error_400(res, "Package not found");

    // lưu lại giao dịch
    let x = await BUY_PACKAGE_BY_CONNECT_WALLET.create({
      transactionHash,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      packageName: packageData.name,
      packageData: JSON.stringify(packageData),
      amountUSDT: amount,
      amountHewe: packageData.amountHEWE,
      amountBonus: packageData.isBonus === true ? packageData.amountBonus : 0,
      timestamp: Date.now().toString(),
      logData: JSON.stringify({}),
    });

    // cập nhật level cho user thực hiện giao dịch
    await updateLevelWhenBuyPackage(user._id, user, packageData);

    // chạy hoa hồng cho người giới thiệu
    await addCommission(user._id, user, x, packageData.amountUSD, packageData.amountHEWE);

    success(res, "Successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

const calcPercentBonus = (amountUSDT) => {
  if (amountUSDT && amountUSDT >= 5000) return 0.01; // 1%
  else return 0;
};

exports.buyTokenV2 = async (req, res) => {
  // cập nhật 3/7/2024: mua token kiểu mới
  // cập nhật 13/8/2024: không còn bonus nữa
  // cập nhật 13/8/2024: giá AMC lấy trực tiếp từ API XT
  // cập nhật 14/8/2024: tính phí 0.05% USDT khi mua AMC
  // cập nhật 27/9/2024: có lại bonus, chỉ áp dụng cho hewe khi mua bằng point hệ thống, không áp dụng swap ví
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { amountUSDT, token } = matchedData(req);

    const HEWE_RATE = (await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue || 0;
    const AMC_RATE = (await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue || 0;

    // check balance USDT
    if (userData.usdtBalance < amountUSDT) return error_400(res, "Insufficient balance USDT");

    if (token === "hewe") {
      let amountHEWE = amountUSDT / HEWE_RATE;
      let percentBonus = calcPercentBonus(amountUSDT);
      let amountBonus = (amountUSDT * percentBonus) / HEWE_RATE; // mua HEWE bonus HEWE

      // trừ USDT, cộng HEWE (gồm cả amount thực và amount bonus), lên lịch sử giao dịch
      await USER.updateOne(
        { _id: userId },
        {
          $inc: {
            usdtBalance: amountUSDT * -1,
            heweBalance: amountHEWE + amountBonus,
          },
        }
      );

      let userAfter = await USER.findOne({ _id: userId });
      let log = {
        before: {
          usdt: userData.usdtBalance,
          hewe: userData.heweBalance,
          amc: userData.amcBalance,
        },
        after: {
          usdt: userAfter.usdtBalance,
          hewe: userAfter.heweBalance,
          amc: userAfter.amcBalance,
        },
        HEWE_RATE, // giá HEWE hiện tại
        AMC_RATE, // giá AMC hiện tại
      };

      let x = await BUY_TOKEN_V2.create({
        userId,
        userName: userData.name,
        userEmail: userData.email,
        tokenBuy: "HEWE",
        tokenBonus: "HEWE",
        amountUSDT,
        amountHewe: amountHEWE,
        amountAmc: 0,
        amountBonus,
        timestamp: Date.now().toString(),
        logData: JSON.stringify(log),
      });

      await addCommissionV2(userId, userData, amountUSDT, x);

      // tính doanh số cho tuyến trên
      await addRevenue(userId, amountUSDT, userData, x._id);

      success(res, "Buy HEWE successfully", {
        amountUSDT,
        amountHEWE,
        amountBonus,
      });
    } else if (token === "amc") {
      let feePercent = 0.0005;
      let feeAmount = amountUSDT * feePercent;

      let amountAMC = (amountUSDT - feeAmount) / AMC_RATE;
      let percentBonus = calcPercentBonus(amountUSDT);
      let amountBonus = ((amountUSDT - feeAmount) * percentBonus) / AMC_RATE; // mua AMC bonus AMC

      // trừ USDT, cộng AMC (gồm cả amount thực và amount bonus), lên lịch sử giao dịch
      await USER.updateOne(
        { _id: userId },
        {
          $inc: {
            usdtBalance: amountUSDT * -1,
            amcBalance: amountAMC + amountBonus,
          },
        }
      );

      let userAfter = await USER.findOne({ _id: userId });
      let log = {
        before: {
          usdt: userData.usdtBalance,
          hewe: userData.heweBalance,
          amc: userData.amcBalance,
        },
        after: {
          usdt: userAfter.usdtBalance,
          hewe: userAfter.heweBalance,
          amc: userAfter.amcBalance,
        },
        HEWE_RATE, // giá HEWE hiện tại
        AMC_RATE, // giá AMC hiện tại
      };

      let x = await BUY_TOKEN_V2.create({
        userId,
        userName: userData.name,
        userEmail: userData.email,
        tokenBuy: "AMC",
        tokenBonus: "AMC",
        amountUSDT,
        amountHewe: 0,
        amountAmc: amountAMC,
        amountBonus,
        timestamp: Date.now().toString(),
        logData: JSON.stringify(log),
        feePercent,
        feeAmount,
      });

      await addCommissionV2(userId, userData, amountUSDT, x);

      // tính doanh số cho tuyến trên
      await addRevenue(userId, amountUSDT, userData, x._id);

      success(res, "Buy AMC successfully", {
        amountUSDT,
        amountAMC,
        amountBonus,
      });
    } else {
      return error_400(res, "Token not found", 1);
    }
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getBuyTokenV2History = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page, type } = matchedData(req);
    // type: api -> lấy lịch sử giao dịch mua token bằng điểm hệ thống (transactionHash null)
    // type: connectWallet -> lấy lịch sử giao dịch mua token bằng cách kết nối ví

    const startIndex = (page - 1) * limit;
    let condition = type === "api" ? { userId, transactionHash: null } : { userId, transactionHash: { $ne: null } };

    const data = await BUY_TOKEN_V2.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await BUY_TOKEN_V2.find(condition).countDocuments();
    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.commissionV2History = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await COMMISSION_V2.find({ commissionUserId: userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    const total = await COMMISSION_V2.find({
      commissionUserId: userId,
    }).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.buyTokenV2Wallet = async (req, res) => {
  try {
    let { address, amount, transactionHash, tokenBuy } = matchedData(req);
    // address là địa chỉ ví user connect khi mua
    // amount là số USDT mua
    // transactionHash là mã giao dịch // kiểm tra trong database có chưa, nếu có rồi thì không xử lý giao dịch đó nữa

    const check = await BUY_TOKEN_V2.findOne({ transactionHash });
    if (check) return error_400(res, "Transaction existed");

    // từ địa chỉ tìm ra thông tin user // nếu không tìm được user thì vẫn lưu giao dịch nhưng không cộng hoa hồng
    const user = await USER.findOne({ walletAddress: address });
    // if (!user) return error_400(res, "Address not found");

    // lưu lại giao dịch
    // lưu ý user có thể không tồn tại
    let x = await BUY_TOKEN_V2.create({
      userId: user ? user._id : null,
      userName: user ? user.name : "",
      userEmail: user ? user.email : "",
      tokenBuy,
      tokenBonus: "", // mua bằng cách này thì bonus tự tính ở đâu đó chứ không quản lý ở đây
      amountUSDT: amount,
      timestamp: Date.now().toString(),
      logData: JSON.stringify({ address, amount, transactionHash, tokenBuy }),
      transactionHash,
      address,
    });

    // chỉ cộng hoa hồng khi user tồn tại
    if (user) {
      await addCommissionV2(user._id, user, amount, x);
      await addRevenue(user._id, amount, user, x._id);
    }

    success(res, "Successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

const round = (num) => Math.floor(num * 100) / 100;

const processSubtract = (heweBalance, heweDeposit, hewe) => {
  // check tổng số dư phải lớn hơn số hewe thực hiện giao dịch
  heweBalance = Number(heweBalance);
  heweDeposit = Number(heweDeposit);
  hewe = Number(hewe);

  let total = heweBalance + heweDeposit;
  if (total < hewe) {
    return {
      status: false,
      message: "Số dư không đủ để thực hiện giao dịch",
    };
  }

  let remaining = hewe;

  // trừ từ heweDeposit trước, nếu không đủ thì trừ từ heweBalance
  if (heweDeposit >= remaining) {
    heweDeposit -= remaining;
    remaining = 0;
  } else {
    remaining -= heweDeposit;
    heweDeposit = 0;
  }

  if (remaining > 0) {
    heweBalance -= remaining;
  }

  // sau khi trừ xong mà số dư âm thì trả về lỗi
  if (heweBalance < 0 || heweDeposit < 0) {
    return {
      status: false,
      message: "Số dư không đủ để thực hiện giao dịch",
    };
  }

  return {
    status: true,
    data: {
      heweBalance,
      heweDeposit,
    },
  };
};

exports.createTransactionHeweDB = async (req, res) => {
  const { keyName } = req.body;
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return await error_400_delRedis(res, "User not found", 1, keyName);

    let { usdt, percent, year } = matchedData(req);
    // lúc tạo giao dịch, 2 số usdthewe = usdtamc = usdt
    // nhưng khi lưu 2 số riêng để khi gia hạn nó sẽ khác

    const HEWE_RATE = (await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue || 0;
    const AMC_RATE = (await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue || 0;

    usdt = round(usdt);
    // tính hewe // làm tròn cho khớp FE
    let hewe = round(usdt / HEWE_RATE);
    // tính amc
    let amc = round(usdt / AMC_RATE);
    // tính amount usdt receive: gấp 2 lần số usdt gửi lên * percent
    let receivedUSDT = round((usdt * 2 * percent) / 100);

    // kiểm tra số dư hewe và amc
    // số dư hewe được dùng cho giao dịch hewedb là tổng của cả 2 cột heweDeposit và heweBalance
    let totalHewe = userData.heweBalance + userData.heweDeposit;
    if (totalHewe < hewe) return await error_400_delRedis(res, "Insufficient balance on HEWE", 1, keyName);
    if (userData.amcBalance < amc) return await error_400_delRedis(res, "Insufficient balance on AMC", 1, keyName);

    let subtractResult = processSubtract(userData.heweBalance, userData.heweDeposit, hewe);
    if (!subtractResult.status) return await error_400_delRedis(res, "Insufficient balance on HEWE", 1, keyName);

    // logic của hewedb: trừ hewe (trừ bằng code rồi nên chỉ cần set vào database), trừ amc, nhận usdt
    await USER.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          heweBalance: subtractResult.data.heweBalance,
          heweDeposit: subtractResult.data.heweDeposit,
        },
        $inc: { amcBalance: amc * -1, usdtBalance: receivedUSDT },
      }
    );

    // lấy thông tin user sau khi update
    const userAfterUpdate = await USER.findOne({ _id: userId });

    // lưu giao dịch
    const transactionId = uuid.v4();
    let x = await TRANSACTION_HEWEDB.create({
      userId,
      userName: userData.name,
      userEmail: userData.email,
      transactionId,
      type: "new",
      previousTransactionId: null,
      hewe,
      priceHewe: HEWE_RATE,
      amc,
      priceAmc: AMC_RATE,
      usdthewe: usdt,
      usdtamc: usdt,
      receivedUSDT,
      percent,
      periodDays: Number(year) * 365,
      startTime: Date.now(),
      endTime: Date.now() + Number(year) * 365 * 24 * 60 * 60 * 1000,
      status: "inprocess",
      logData: JSON.stringify({
        before: {
          usdt: userData.usdtBalance,
          hewe: userData.heweBalance,
          amc: userData.amcBalance,
          heweDeposit: userData.heweDeposit,
        },
        after: {
          usdt: userAfterUpdate.usdtBalance,
          hewe: userAfterUpdate.heweBalance,
          amc: userAfterUpdate.amcBalance,
          heweDeposit: userAfterUpdate.heweDeposit,
        },
        HEWE_RATE, // giá HEWE hiện tại
        AMC_RATE, // giá AMC hiện tại
      }),
    });

    await delRedis(keyName);
    success(res, "Create transaction successfully", true);
  } catch (error) {
    console.log(error);
    await delRedis(keyName);
    error_500(res, error);
  }
};

exports.getTransactionHeweDB = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await TRANSACTION_HEWEDB.find({
      userId,
      status: { $ne: "extend" },
    })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    const total = await TRANSACTION_HEWEDB.find({
      userId,
      status: { $ne: "extend" },
    }).countDocuments();

    success(res, "Create transaction successfully", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getTransactionHeweDB_F1User = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    // tìm tất cả F1 của user
    let f1Array = await getF1(userId);
    let f1TransactionArray = [];
    for (let user of f1Array) {
      // xét từng F1 tìm tất cả giao dịch của họ (trừ giao dịch extend)
      // lấy tất cả không phân trang

      let f1Id = user.referredUser_id;
      let condition = { status: { $ne: "extend" }, userId: f1Id };
      const data = await TRANSACTION_HEWEDB.find(condition).sort({
        createdAt: -1,
      });
      f1TransactionArray = [...f1TransactionArray, ...data];
    }

    success(res, "OK", f1TransactionArray);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.completeTransactionHeweDB = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { transactionId } = matchedData(req);

    // kiểm tra giao dịch
    let transaction = await TRANSACTION_HEWEDB.findOne({
      transactionId,
      userId,
      status: "inprocess",
    });
    if (!transaction) return error_400(res, "Transaction not found");

    // kiểm tra giao dịch phải qua 365 ngày mới được hoàn thành
    let currentTime = Date.now();
    let endTime = new Date(transaction.endTime).getTime();
    if (currentTime < endTime) return error_400(res, "Please wait until the end of 365 days period");

    // ban đầu đã cộng cho user 1 khoảng receivedUSDT, giờ trừ lại
    // kiểm tra số dư usdt hiện tại -> trừ
    let receivedUSDT = transaction.receivedUSDT;
    if (userData.usdtBalance < receivedUSDT)
      return error_400(res, "You do not have enough USDT to complete this transaction");

    // nhận lại hewe và amc đã trừ ban đầu (lúc này có thể giá hewe và amc cao hơn thời điểm ban đầu, nên user sẽ có lời)
    let hewe = transaction.hewe;
    let amc = transaction.amc;

    await USER.updateOne(
      { _id: userId },
      {
        $inc: {
          usdtBalance: receivedUSDT * -1,
          heweBalance: hewe,
          amcBalance: amc,
        },
      }
    );

    // lấy thông tin user sau khi update
    const userAfterUpdate = await USER.findOne({ _id: userId });

    // cập nhật trạng thái giao dịch là completed, cập nhật log
    const log = JSON.stringify({
      before: {
        usdt: userData.usdtBalance,
        hewe: userData.heweBalance,
        amc: userData.amcBalance,
        heweDeposit: userData.heweDeposit,
      },
      after: {
        usdt: userAfterUpdate.usdtBalance,
        hewe: userAfterUpdate.heweBalance,
        amc: userAfterUpdate.amcBalance,
        heweDeposit: userAfterUpdate.heweDeposit,
      },
    });
    await TRANSACTION_HEWEDB.updateOne({ transactionId }, { $set: { status: "completed", logData2: log } });

    success(res, "Transaction finished", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

// exports.completeHeweDB = async (req, res) => {
//   // logic hoàn thành hewedb 2025 cập nhật 4/7/2025
//   try {
//     const userData = req.user;
//     const userId = userData._id;
//     if (!userData || !userData || !userId) return error_400(res, "User not found");

//     let { transactionId } = matchedData(req);

//     // kiểm tra giao dịch
//     let transaction = await TRANSACTION_HEWEDB.findOne({
//       transactionId,
//       userId,
//       status: "inprocess",
//     });
//     if (!transaction) return error_400(res, "Transaction not found");

//     // kiểm tra giao dịch phải qua 365 ngày mới được hoàn thành
//     let currentTime = Date.now();
//     let endTime = new Date(transaction.endTime).getTime();
//     if (currentTime < endTime) return error_400(res, "Please wait until the end of 365 days period");

//     // logic mới: không cần trừ USDT nữa (đã gọi điện hỏi xác nhận)
//     // chỉ nhận lại hewe và amc đã trừ ban đầu là xong

//     let hewe = transaction.hewe;
//     let amc = transaction.amc;

//     await USER.updateOne(
//       { _id: userId },
//       {
//         $inc: {
//           heweBalance: hewe,
//           amcBalance: amc,
//         },
//       }
//     );

//     const userAfterUpdate = await USER.findOne({ _id: userId });

//     // cập nhật trạng thái giao dịch là completed, cập nhật log
//     const log = JSON.stringify({
//       before: {
//         usdt: userData.usdtBalance,
//         hewe: userData.heweBalance,
//         amc: userData.amcBalance,
//         heweDeposit: userData.heweDeposit,
//       },
//       after: {
//         usdt: userAfterUpdate.usdtBalance,
//         hewe: userAfterUpdate.heweBalance,
//         amc: userAfterUpdate.amcBalance,
//         heweDeposit: userAfterUpdate.heweDeposit,
//       },
//     });
//     await TRANSACTION_HEWEDB.updateOne({ transactionId }, { $set: { status: "completed", logData2: log } });

//     success(res, "Transaction finished", true);
//   } catch (error) {
//     console.log(error);
//     error_500(res, error);
//   }
// };

exports.extendTransactionHeweDB = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");
	  
	  return error_400(res, "Not available", false); // cập nhật 3/7/2025: đã có API mới

    let { transactionId } = matchedData(req);

    // kiểm tra giao dịch
    let transaction = await TRANSACTION_HEWEDB.findOne({
      transactionId,
      userId,
      status: "inprocess",
    });
    if (!transaction) return error_400(res, "Transaction not found");

    // phải qua 365 ngày mới được gia hạn
    let currentTime = Date.now();
    let endTime = new Date(transaction.endTime).getTime();
    if (currentTime < endTime) return error_400(res, "Please wait until the end of 365 days period");

    // số hewe và amc ban đầu vẫn giữ nguyên, nhưng sẽ quy đổi ra usdt theo giá hiện tại -> được nhiều usdt hơn
    const HEWE_RATE = (await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue || 0;
    const AMC_RATE = (await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue || 0;

    let { hewe, amc, usdthewe, usdtamc, percent, receivedUSDT } = transaction;
    let newUSDTHEWE = hewe * HEWE_RATE;
    let newUSDTAMC = amc * AMC_RATE;
    let totalUSDTBefore = usdthewe + usdtamc;
    let totalUSDTAfter = round(newUSDTHEWE + newUSDTAMC);

    // user sẽ nhận thêm {percent}% số usdt mới (percent vẫn giữ như lúc tạo project) - số usdt đã nhận trước đó
    let newReceivedUSDT = round((totalUSDTAfter * percent) / 100 - receivedUSDT);

    // cộng newReceivedUSDT cho user
    await USER.updateOne({ _id: userId }, { $inc: { usdtBalance: newReceivedUSDT } });

    const userAfterUpdate = await USER.findOne({ _id: userId });
    let log = {
      before: {
        usdt: userData.usdtBalance,
        hewe: userData.heweBalance,
        amc: userData.amcBalance,
        heweDeposit: userData.heweDeposit,
      },
      after: {
        usdt: userAfterUpdate.usdtBalance,
        hewe: userAfterUpdate.heweBalance,
        amc: userAfterUpdate.amcBalance,
        heweDeposit: userAfterUpdate.heweDeposit,
      },
    };

    // giao dịch cũ đánh dấu extend, tạo giao dịch mới
    await TRANSACTION_HEWEDB.updateOne(
      { transactionId },
      { $set: { status: "extend", logData2: JSON.stringify(log) } }
    );
    const newTransactionId = uuid.v4();
    let x = await TRANSACTION_HEWEDB.create({
      userId,
      userName: userData.name,
      userEmail: userData.email,
      transactionId: newTransactionId,
      type: "extend",
      previousTransactionId: transactionId,
      hewe,
      priceHewe: HEWE_RATE,
      amc,
      priceAmc: AMC_RATE,
      usdthewe: newUSDTHEWE,
      usdtamc: newUSDTAMC,
      receivedUSDT: receivedUSDT + newReceivedUSDT,
      percent,
      periodDays: 365,
      startTime: Date.now(),
      endTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
      status: "inprocess",
      logData: JSON.stringify(log),
    });

    // cập nhật 6/8/2024: khi user gia hạn thì tuyến trên của user đó sẽ nhận được hoa hồng
    // giá trị hoa hồng: % tổng số USDT lúc gia hạn (totalUSDTAfter)
    // thêm type "hewedb"
    await addCommissionV2_extendHeweDB(userId, userData, totalUSDTAfter, x, "hewedb");

    success(res, "Extend transaction successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

const functionExtend = async (userId, userData, transactionId, transaction, year, note) => {
  // số hewe và amc ban đầu vẫn giữ nguyên, nhưng sẽ quy đổi ra usdt theo giá hiện tại
  // có thể nhiều hơn hoặc ít hơn so với giá USDT ban đầu tuỳ tỉ giá
  const HEWE_RATE = (await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue || 0;
  const AMC_RATE = (await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue || 0;

  let { hewe, amc, usdthewe, usdtamc, percent, receivedUSDT } = transaction;
  let newUSDTHEWE = hewe * HEWE_RATE;
  let newUSDTAMC = amc * AMC_RATE;
  let totalUSDTBefore = usdthewe + usdtamc;
  let totalUSDTAfter = round(newUSDTHEWE + newUSDTAMC);

  let newReceivedUSDTPercent;
  if (totalUSDTAfter < 1900) {
    newReceivedUSDTPercent = year === 1 ? 10 : 20; // 10% cho 1 năm, 20% cho 2 năm
  } else {
    newReceivedUSDTPercent = year === 1 ? 20 : 30; // 20% cho 1 năm, 30% cho 2 năm
  }

  let newReceivedUSDT = totalUSDTAfter * (newReceivedUSDTPercent / 100);

  // cập nhật 14/7/2025: tính chênh lệch giữa newReceivedUSDT và receivedUSDT ban đầu
  // trường hợp giá tăng, newReceivedUSDT > receivedUSDT -> diff dương -> user sẽ được cộng phần chênh lệch (chứ không được cộng toàn bộ newReceivedUSDT))
  // trường hợp giá giảm, newReceivedUSDT < receivedUSDT -> diff âm -> user cũng sẽ được cộng phần chênh lệch, mà diff âm tương đương trừ đi
  // không cần kiểm tra có đủ số dư USDT hay không, nếu không đủ phần bị trừ thì cho ra số âm cũng được

  const diff = newReceivedUSDT - receivedUSDT;

  // cộng diff cho user
  await USER.updateOne({ _id: userId }, { $inc: { usdtBalance: diff } });

  const userAfterUpdate = await USER.findOne({ _id: userId });
  let log = {
    before: {
      usdt: userData.usdtBalance,
      hewe: userData.heweBalance,
      amc: userData.amcBalance,
      heweDeposit: userData.heweDeposit,
    },
    after: {
      usdt: userAfterUpdate.usdtBalance,
      hewe: userAfterUpdate.heweBalance,
      amc: userAfterUpdate.amcBalance,
      heweDeposit: userAfterUpdate.heweDeposit,
    },
    data: {
      year,
      hewePrice: HEWE_RATE,
      amcPrice: AMC_RATE,
      totalUSDTAfter,
      newReceivedUSDT,
      receivedUSDT,
      diff,
	  note: note || "", // ghi chú nếu có
    },
  };

  // giao dịch cũ đánh dấu extend, tạo giao dịch mới
  await TRANSACTION_HEWEDB.updateOne({ transactionId }, { $set: { status: "extend", logData2: JSON.stringify(log) } });
  const newTransactionId = uuid.v4();
  let x = await TRANSACTION_HEWEDB.create({
    userId,
    userName: userData.name,
    userEmail: userData.email,
    transactionId: newTransactionId,
    type: "extend", // phân biệt với type "new" là giao dịch tạo lần đầu
    previousTransactionId: transactionId,
    hewe,
    priceHewe: HEWE_RATE,
    amc,
    priceAmc: AMC_RATE,
    usdthewe: newUSDTHEWE,
    usdtamc: newUSDTAMC,
    receivedUSDT: newReceivedUSDT,
    percent: newReceivedUSDTPercent, // % nhận được mới
    periodDays: 365 * year,
    startTime: Date.now(),
    endTime: Date.now() + 365 * year * 24 * 60 * 60 * 1000,
    status: "inprocess",
    logData: JSON.stringify(log),
    diff,
  });

  // cập nhật 6/8/2024: khi user gia hạn thì tuyến trên của user đó sẽ nhận được hoa hồng
  // giá trị hoa hồng: % tổng số USDT lúc gia hạn (totalUSDTAfter)
  // thêm type "hewedb"
  await addCommissionV2_extendHeweDB(userId, userData, totalUSDTAfter, x, "hewedb");
};

exports.extendHeweDB2025 = async (req, res) => {
  // logic gia hạn hewedb 2025 cập nhật 3/7/2025
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found");

    let { transactionId, year } = matchedData(req);

    // kiểm tra giao dịch
    let transaction = await TRANSACTION_HEWEDB.findOne({
      transactionId,
      userId,
      status: "inprocess",
    });
    if (!transaction) return error_400(res, "Transaction not found");

    // phải qua 365 ngày mới được gia hạn
    let currentTime = Date.now();
    let endTime = new Date(transaction.endTime).getTime();
    if (currentTime < endTime) return error_400(res, "Please wait until the end of 365 days period");

    if (![1, 2].includes(year)) return error_400(res, "Please choose a period of 1 or 2 years to renew");

    await functionExtend(userId, userData, transactionId, transaction, year);

    success(res, "Renew transaction successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.callFunctionExtend = async (userId, userData, transactionId, transaction, year, note) => {
  await functionExtend(userId, userData, transactionId, transaction, year, note);
};

exports.getConfigPrice = async (req, res) => {
  try {
    let { token } = matchedData(req);
    let tokenText = token.toLowerCase() + "Price";

    let data = await CONFIG_VALUE.findOne({ configKey: tokenText });
    let price = data ? data.configValue : null;

    success(res, "Successfully", price);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.testTelegram = async (req, res) => {
  try {
    let userData = {
      name: "Test",
      email: "hhuuthien@gmail.com",
    };
    let amount = 100;
    let address = "0x123456789";
    let method = "ABC20";

    // send telegram channel
    await sendTelegramMessageToChannel(
      `Withdraw TEST\nUser: ${userData.name}\nEmail: ${userData.email}\nAmount: ${amount}\nAddress: ${address}\nMethod: ${method}`
    );
    success(res, "OK", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

const getF1 = async (userId) => {
  // tìm userId trong bảng referral -> lấy mảng referredTo là mảng tất cả F1 của user đó
  try {
    const refData = await REFERRAL.findOne({ user_id: userId });
    if (refData && refData.referredTo) {
      return refData.referredTo;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

exports.getTreeByUserId = async (req, res) => {
  try {
    // api này cho user truyền lên userId -> trả về cây network của user đó
    // xét token để đảm bảo user đó đã login -> nhưng truyền userId bất kỳ lên đều có thể lấy được data
    // không bảo mật lắm, nên chỉ trả về những data cần thiết để hiển thị trên cây thôi
    let neccessaryData = "name email";

    const { userId } = matchedData(req);
    const userData = await USER.findOne({ _id: userId }).select(neccessaryData);

    // get list F1
    let f1Array = await getF1(userId);
    let f1ArrayData = [];
    for (let f1 of f1Array) {
      // lấy thông tin chi tiết
      let f1Data = await USER.findOne({ _id: f1.referredUser_id }).select(neccessaryData);
      // kiểm tra số lượng F1 (để làm cây network)
      let childCount = (await getF1(f1.referredUser_id)).length;
      f1Data = { ...f1Data._doc, childCount };
      f1ArrayData.push(f1Data);
    }

    success(res, "OK", { userData, f1ArrayData });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDepositHeweAddress = async (req, res) => {
  // api này lấy địa chỉ nhận hewe nạp của admin, hiển thị ở giao diện để user biết mà chuyển tiền vào
  // tất cả user đều lấy cùng 1 địa chỉ này lưu trên database

  // quan trọng: mỗi khi user vào tab nạp hewe trên fe, gọi API này thì phải mở khoá ví cho user đó
  // ví của user là cái walletAddress trong model USER
  try {
    const userData = req.user;
    const userId = userData._id;
    if (!userData || !userData || !userId) return error_400(res, "User not found", 1);

    let userDataWalletAddress = userData?.walletAddress;
    if (!userDataWalletAddress) return error_400(res, "Please update your wallet address", 1);

    // mở khoá ví cho user
	// cập nhật 16/12/2024: bắt đầu từ ngày mai 17/12 không gọi API mở khoá nữa
    // await unblockAddress(userDataWalletAddress);

    let receiveHeweDepositAddress = (await CONFIG_VALUE.findOne({ configKey: "receiveHeweDeposit" }))
      ?.configValueString;

    success(res, "OK", receiveHeweDepositAddress);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.checkUserHeweDB = async (req, res) => {
  // nếu user có giao dịch hewedb thì trả về true, ngược lại false
  try {
    let { email } = matchedData(req);
    let check = await TRANSACTION_HEWEDB.findOne({
      userEmail: email,
      status: "inprocess",
    });
    let result = Boolean(check);
    success(res, "OK", { isUserInHeweDB: result });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getPrices = async (req, res) => {
  try {
    let priceAMC = Number((await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue);
    let priceHEWE = Number((await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue);
    success(res, "OK", { priceAMC, priceHEWE });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};
