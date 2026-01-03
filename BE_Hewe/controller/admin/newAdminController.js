const { matchedData } = require("express-validator");
const { success, error_500, error_400 } = require("../../utils/error");
const BUY_TRANSACTION_HISTORY = require("../../model/buyTransactionHistoryModel");
const WITHDRAW_HEWE = require("../../model/withdrawHeweModel");
const WITHDRAW_AMC = require("../../model/withdrawAmcModel");
const WITHDRAW = require("../../model/withdrawModel");
const USER = require("../../model/userModel");
const SWAP_TRANSACTION_HISTORY = require("../../model/swapTransactionHistoryModel");
const BUY_TOKEN_V2 = require("../../model/buyTokenV2Model");
const DEPOSIT = require("../../model/depositModel");
const DEPOSIT_AMC = require("../../model/depositAMCModel");
const DEPOSIT_HEWE = require("../../model/depositHEWEModel");
const LOG = require("../../model/logModel");
const BUY_PACKAGE_BY_USDT = require("../../model/buyPackageByUsdtModel");
const COMMISSION = require("../../model/commissionModel");
const COMMISSION_V2 = require("../../model/commissionV2Model");
const CONFIG_VALUE = require("../../model/configValueModel");
const TRANSACTION_HEWEDB = require("../../model/transactionDbModel");
const HOMEPAGE_SWAP = require("../../model/homepageSwapTransaction");
const REFERRAL = require("../../model/referralModel");
const REVENUE = require("../../model/revenueModel");
const WALLET_USER = require("../../model/walletUserModel");
const HISTORY_UPDATE_WALLET = require("../../model/historyUpdateWallet");
const BRANCH_HISTORY = require("../../model/branchModel");
const MAIL_HISTORY = require("../../model/mailHistoryModel");
const { addCommissionV2, addRevenue } = require("../../utils/addCommission");
const { transferAMC } = require("../../module/transferAMC");
const { transferHEWE } = require("../../module/transferHEWE");
const { getDataConfigValueFn } = require("../../module/getDataConfigValue");
require("dotenv").config();
const { writeLog } = require("../../module/log");
const { getEventContractOnlyOneBlock2025 } = require("../blockchain");

const { default: mongoose } = require("mongoose");
const TransactionUpdateLog = require("../../model/TransactionUpdateLog");
exports.getAllTransactionsBuyBCFVND = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await BUY_TRANSACTION_HISTORY.find().sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    const total = await BUY_TRANSACTION_HISTORY.find().countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.confirmTransactionsBuyBCFVND = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là userConfirmed thì mới cho admin xác nhận
    const transactionData = await BUY_TRANSACTION_HISTORY.findOne({ _id: transactionId, status: "userConfirmed" });
    if (!transactionData) return error_400(res, "Transaction not found or user not confirmed yet");

    const userId = transactionData.userId;

    const userBefore = await USER.findOne({ _id: userId });

    // cộng HEWE cho user
    await USER.updateOne({ _id: userId }, { $inc: { heweBalance: transactionData.amountHewe } });

    const userAfter = await USER.findOne({ _id: userId });

    const logData = {
      adminId,
      heweBefore: userBefore.heweBalance,
      heweAfter: userAfter.heweBalance,
    };

    // cập nhật trạng thái giao dịch
    await BUY_TRANSACTION_HISTORY.updateOne(
      { _id: transactionId },
      { status: "adminConfirmed", timeAdminConfirmed: new Date(), logData: JSON.stringify(logData) }
    );

    success(res, "Transaction confirmed successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.rejectTransactionsBuyBCFVND = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là userConfirmed thì mới cho admin từ chối
    const transactionData = await BUY_TRANSACTION_HISTORY.findOne({ _id: transactionId, status: "userConfirmed" });
    if (!transactionData) return error_400(res, "Transaction not found or user not confirmed yet");

    // admin từ chối chỉ cần cập nhật trạng thái là xong

    const userId = transactionData.userId;
    const userData = await USER.findOne({ _id: userId });

    const logData = {
      adminId,
      heweBefore: userData.heweBalance,
      heweAfter: userData.heweBalance,
    };

    // cập nhật trạng thái giao dịch
    await BUY_TRANSACTION_HISTORY.updateOne(
      { _id: transactionId },
      { status: "adminRejected", timeAdminRejected: new Date(), logData: JSON.stringify(logData) }
    );

    success(res, "Transaction rejected", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getAllTransactionsWithdrawHewe = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword } = matchedData(req);

    let condition = {};
    if (keyword) {
      condition = {
        $or: [
          { transactionHash: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await WITHDRAW_HEWE.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await WITHDRAW_HEWE.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.approveWithdrawHewe = async (req, res) => {
  // admin xác nhận rút HEWE: nhập hash giao dịch, cập nhật trạng thái, số HEWE đã trừ lúc tạo giao dịch nên không cần trừ nữa
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, transactionHash } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin xác nhận
    const transactionData = await WITHDRAW_HEWE.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    const adminLogData = {
      adminId,
    };

    await WITHDRAW_HEWE.updateOne(
      { _id: transactionId },
      { status: "approved", transactionHash, timeAdminApproved: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Transaction approved successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.approveWithdrawHeweAutoTransfer = async (req, res) => {
  // admin xác nhận rút HEWE tự động chuyển
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin xác nhận
    const transactionData = await WITHDRAW_HEWE.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    const adminLogData = {
      adminId,
      type: "transferByCode",
    };

    // tự động chuyển HEWE
    let ENV_TRANSFER_HEWE_ADDRESS = await getDataConfigValueFn("ENV_TRANSFER_HEWE_ADDRESS");
    let ENV_TRANSFER_HEWE_PRIVATE_KEY = await getDataConfigValueFn("ENV_TRANSFER_HEWE_PRIVATE_KEY");
    let resultTransfer = await transferHEWE(
      transactionData.amount,
      transactionData.address,
      ENV_TRANSFER_HEWE_ADDRESS,
      ENV_TRANSFER_HEWE_PRIVATE_KEY
    );

    if (!resultTransfer) {
      return error_400(
        res,
        "Duyệt tự động không thành công, vui lòng thử lại sau hoặc dùng chức năng duyệt thủ công",
        1
      );
    } else {
      await WITHDRAW_HEWE.updateOne(
        { _id: transactionId },
        {
          status: "approved",
          transactionHash: resultTransfer?.transactionHash,
          timeAdminApproved: new Date(),
          adminLogData: JSON.stringify(adminLogData),
        }
      );

      success(res, "Transaction approved successfully", true);
    }
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.rejectWithdrawHewe = async (req, res) => {
  // admin từ chối lệnh rút hewe: nhập lý do từ chối, cập nhật trạng thái, trả lại số HEWE đã trừ lúc tạo giao dịch
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, reason } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin huỷ
    const transactionData = await WITHDRAW_HEWE.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    // trả lại số HEWE đã trừ lúc tạo giao dịch
    const userId = transactionData.userId;
    const userBefore = await USER.findOne({ _id: userId });
    await USER.updateOne({ _id: userId }, { $inc: { heweBalance: transactionData.amount } });
    const userAfter = await USER.findOne({ _id: userId });

    const adminLogData = {
      adminId,
      userBefore: {
        hewe: userBefore.heweBalance,
        usdt: userBefore.usdtBalance,
      },
      userAfter: {
        hewe: userAfter.heweBalance,
        usdt: userAfter.usdtBalance,
      },
    };

    await WITHDRAW_HEWE.updateOne(
      { _id: transactionId },
      { status: "rejected", reason, timeAdminRejected: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Transaction rejected", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getAllTransactionsWithdrawAmc = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword } = matchedData(req);

    let condition = {};
    if (keyword) {
      condition = {
        $or: [
          { transactionHash: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await WITHDRAW_AMC.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await WITHDRAW_AMC.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.approveWithdrawAmc = async (req, res) => {
  // admin xác nhận rút AMC: nhập hash giao dịch, cập nhật trạng thái, số AMC đã trừ lúc tạo giao dịch nên không cần trừ nữa
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, transactionHash } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin xác nhận
    const transactionData = await WITHDRAW_AMC.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    const adminLogData = {
      adminId,
    };

    await WITHDRAW_AMC.updateOne(
      { _id: transactionId },
      { status: "approved", transactionHash, timeAdminApproved: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Transaction approved successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.approveWithdrawAmcAutoTransfer = async (req, res) => {
  // admin xác nhận rút AMC tự động chuyển
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin xác nhận
    const transactionData = await WITHDRAW_AMC.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    const adminLogData = {
      adminId,
      type: "transferByCode",
    };

    // tự động chuyển AMC
    let ENV_TRANSFER_AMC_ADDRESS = await getDataConfigValueFn("ENV_TRANSFER_AMC_ADDRESS");
    let ENV_TRANSFER_AMC_PRIVATE_KEY = await getDataConfigValueFn("ENV_TRANSFER_AMC_PRIVATE_KEY");
    let resultTransfer = await transferAMC(
      ENV_TRANSFER_AMC_ADDRESS,
      transactionData.address,
      transactionData.amount,
      ENV_TRANSFER_AMC_PRIVATE_KEY
    );

    if (!resultTransfer) {
      return error_400(
        res,
        "Duyệt tự động không thành công, vui lòng thử lại sau hoặc dùng chức năng duyệt thủ công",
        1
      );
    } else {
      await WITHDRAW_AMC.updateOne(
        { _id: transactionId },
        {
          status: "approved",
          transactionHash: resultTransfer,
          timeAdminApproved: new Date(),
          adminLogData: JSON.stringify(adminLogData),
        }
      );

      success(res, "Transaction approved successfully", true);
    }
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.rejectWithdrawAmc = async (req, res) => {
  // admin từ chối lệnh rút amc: nhập lý do từ chối, cập nhật trạng thái, trả lại số AMC đã trừ lúc tạo giao dịch
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, reason } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin huỷ
    const transactionData = await WITHDRAW_AMC.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    // trả lại số AMC đã trừ lúc tạo giao dịch
    const userId = transactionData.userId;
    const userBefore = await USER.findOne({ _id: userId });
    await USER.updateOne({ _id: userId }, { $inc: { amcBalance: transactionData.amount } });
    const userAfter = await USER.findOne({ _id: userId });

    const adminLogData = {
      adminId,
      userBefore: {
        hewe: userBefore.heweBalance,
        usdt: userBefore.usdtBalance,
        amc: userBefore.amcBalance,
      },
      userAfter: {
        hewe: userAfter.heweBalance,
        usdt: userAfter.usdtBalance,
        amc: userAfter.amcBalance,
      },
    };

    await WITHDRAW_AMC.updateOne(
      { _id: transactionId },
      { status: "rejected", reason, timeAdminRejected: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Transaction rejected", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getSwapHistoryAdmin = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, type, token, keyword } = matchedData(req);
    // type: api -> lấy lịch sử giao dịch mua token bằng điểm hệ thống (transactionHash null)
    // type: connectWallet -> lấy lịch sử giao dịch mua token bằng cách kết nối ví

    const startIndex = (page - 1) * limit;
    let condition = type === "api" ? { transactionHash: null } : { transactionHash: { $ne: null } };
    if (token) {
      condition = {
        ...condition,
        $or: [{ tokenBuy: token.toUpperCase() }, { tokenBuy: token }],
      };
    }
    if (keyword) {
      condition = {
        ...condition,
        $or: [
          { transactionHash: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const data = await BUY_TOKEN_V2.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await BUY_TOKEN_V2.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDepositUSDTHistoryAdmin = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword, network } = matchedData(req);
    let condition = {};
    // những giao dịch có amountAfter = -99 là giao dịch chưa xác nhận, chưa cộng tiền cho user, không hiển thị lịch sử
    // cập nhật 15/8/2024: vẫn hiển thị giao dịch chưa xác nhận, để ổng coi và tự xác nhận thủ công
    if (network) {
      condition = { ...condition, coinKey: `USDT.${network}` };
    }
    if (keyword) {
      condition = {
        ...condition,
        $or: [
          { transactionHash: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await DEPOSIT.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await DEPOSIT.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDepositAMCHistoryAdmin = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword } = matchedData(req);
    let condition = {};
    if (keyword) {
      condition = {
        ...condition,
        $or: [
          { transactionHash: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await DEPOSIT_AMC.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await DEPOSIT_AMC.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDepositHEWEHistoryAdmin = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword } = matchedData(req);
    let condition = {};
    if (keyword) {
      condition = {
        ...condition,
        $or: [
          { transactionHash: { $regex: keyword, $options: "i" } },
          { fromAddress: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await DEPOSIT_HEWE.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await DEPOSIT_HEWE.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.setUSDTBalance = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId, amount } = matchedData(req);

    const findUser = await USER.findOne({ _id: userId });
    if (!findUser) return error_400(res, "User not found");

    await USER.updateOne({ _id: userId }, { usdtBalance: amount });

    await LOG.create({
      type: "setUSDTBalance",
      data: JSON.stringify({ adminId, userId, oldData: findUser.usdtBalance, newData: amount }),
    });

    success(res, "Updated", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.setHEWEBalance = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId, amount } = matchedData(req);

    const findUser = await USER.findOne({ _id: userId });
    if (!findUser) return error_400(res, "User not found");

    await USER.updateOne({ _id: userId }, { heweBalance: amount });

    await LOG.create({
      type: "setHEWEBalance",
      data: JSON.stringify({ adminId, userId, oldData: findUser.heweBalance, newData: amount }),
    });

    success(res, "Updated", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.setAMCBalance = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId, amount } = matchedData(req);

    const findUser = await USER.findOne({ _id: userId });
    if (!findUser) return error_400(res, "User not found");

    await USER.updateOne({ _id: userId }, { amcBalance: amount });

    await LOG.create({
      type: "setAMCBalance",
      data: JSON.stringify({ adminId, userId, oldData: findUser.amcBalance, newData: amount }),
    });

    success(res, "Updated", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getAllTransactionsWithdrawUSDT = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword } = matchedData(req);

    let condition = {};
    if (keyword) {
      condition = {
        $or: [
          { transactionHash: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await WITHDRAW.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await WITHDRAW.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.approveWithdrawUSDT = async (req, res) => {
  // admin xác nhận rút USDT: nhập hash giao dịch, cập nhật trạng thái, số USDT đã trừ lúc tạo giao dịch nên không cần trừ nữa
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, transactionHash } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin xác nhận
    const transactionData = await WITHDRAW.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    const adminLogData = {
      adminId,
    };

    await WITHDRAW.updateOne(
      { _id: transactionId },
      { status: "approved", transactionHash, timeAdminApproved: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Transaction approved successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.rejectWithdrawUSDT = async (req, res) => {
  // admin từ chối lệnh rút USDT: nhập lý do từ chối, cập nhật trạng thái, trả lại số USDT đã trừ lúc tạo giao dịch
  // số USDT trả lại = cột amount
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, reason } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin huỷ
    const transactionData = await WITHDRAW.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    // trả lại số USDT đã trừ lúc tạo giao dịch
    const userId = transactionData.userId;
    const userBefore = await USER.findOne({ _id: userId });
    await USER.updateOne({ _id: userId }, { $inc: { usdtBalance: transactionData.amount } });
    const userAfter = await USER.findOne({ _id: userId });

    const adminLogData = {
      adminId,
      userBefore: {
        hewe: userBefore.heweBalance,
        usdt: userBefore.usdtBalance,
      },
      userAfter: {
        hewe: userAfter.heweBalance,
        usdt: userAfter.usdtBalance,
      },
    };

    await WITHDRAW.updateOne(
      { _id: transactionId },
      { status: "rejected", reason, timeAdminRejected: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Transaction rejected", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getHistoryBuyPackageHeweByUSDTAdmin = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page } = matchedData(req);

    const startIndex = (page - 1) * limit;
    const data = await BUY_PACKAGE_BY_USDT.find().sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await BUY_PACKAGE_BY_USDT.find().countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getCommissionHistory = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword } = matchedData(req);

    let condition = {};
    if (keyword) {
      condition = {
        $or: [
          { userEmail: { $regex: keyword, $options: "i" } },
          { commissionUserEmail: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await COMMISSION_V2.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await COMMISSION_V2.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.approveCommission = async (req, res) => {
  // admin xác nhận hoa hồng: tự chuyển cho user, nhập hash giao dịch, cập nhật trạng thái là xong
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, transactionHash } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin xác nhận
    const transactionData = await COMMISSION.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    const adminLogData = {
      adminId,
    };

    await COMMISSION.updateOne(
      { _id: transactionId, status: "pending" },
      { status: "approved", transactionHash, timeAdminApproved: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Approved successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.rejectCommission = async (req, res) => {
  // admin từ chối hoa hồng: nhập lý do từ chối, cập nhật trạng thái là xong
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { transactionId, reason } = matchedData(req);

    // check giao dịch tồn tại, trạng thái là pending thì mới cho admin huỷ
    const transactionData = await COMMISSION.findOne({ _id: transactionId, status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    const adminLogData = {
      adminId,
    };

    await COMMISSION.updateOne(
      { _id: transactionId, status: "pending" },
      { status: "rejected", reason, timeAdminRejected: new Date(), adminLogData: JSON.stringify(adminLogData) }
    );

    success(res, "Rejected", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.adminGetPricing = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { token } = matchedData(req);
    let tokenText = `${token}Price`;

    let data = (await CONFIG_VALUE.findOne({ configKey: tokenText }))?.configValue;
    success(res, "OK", data);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.adminUpdatePricing = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { token, newPrice } = matchedData(req);
    let tokenText = `${token}Price`;

    await CONFIG_VALUE.updateOne({ configKey: tokenText }, { configValue: newPrice });
    await writeLog(`Admin ${adminId} updated ${tokenText} to ${newPrice} at ${new Date()}`);
    success(res, "Updated successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.editHeweDBDataToId = async (req, res) => {
  try {
    const { id, percent, years} = req.body;
    if (!id) return error_400(res, "Thiếu ID");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error_400(res, "ID không hợp lệ");
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const record = await TRANSACTION_HEWEDB.findById(objectId);
    if (!record) return error_400(res, "Không tìm thấy dữ liệu với ID này");

    // ✅ Tính số năm hiện tại
    const startTime = new Date(record.startTime);
    const endTime = new Date(record.endTime);

    const diffInMs = endTime - startTime;
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365);

    // ✅ Tính endTime mới bằng cách cộng thêm `years` vào endTime hiện tại
    const updatedEndTime = new Date(endTime);
    updatedEndTime.setFullYear(endTime.getFullYear() + Number(years));

    // ✅ Cập nhật endTime mới vào DB
    await TRANSACTION_HEWEDB.updateOne(
      { _id: objectId },
      { $set: { endTime: updatedEndTime } }
    );

    // ✅ Lấy lại thông tin user
    const { usdtamc, usdthewe, userId } = record;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    const userData = await USER.findById(objectIdUser);
    if (!userData) return error_400(res, "Không tìm thấy dữ liệu với UserId này");

    const { usdtBalance, _id, email, name } = userData;
    const totalUsdt = usdtamc + usdthewe;
    const percentAmount = percent / 100;
    const amountUsdtRecevied = totalUsdt * percentAmount;

    await USER.updateOne(
      { _id: userId },
      { $inc: { usdtBalance: amountUsdtRecevied } }
    );
    await TransactionUpdateLog.create({
      userId: userData._id,
      userName: userData.name,
      email: userData.email,
      transactionId: record._id,
      oldEndTime: endTime,
      newEndTime: updatedEndTime,
      oldBalance: usdtBalance,
      newBalance: usdtBalance + amountUsdtRecevied,
      diffBalance: amountUsdtRecevied,
      yearsAdded: Number(years),
    });
    success(res, "Cập nhật thành công", {
      transactionId: id,
      oldEndTime: endTime,
      newEndTime: updatedEndTime,
      addedUsdt: amountUsdtRecevied,
    });
  } catch (error) {
    console.error("Lỗi khi tìm dữ liệu:", error);
    error_500(res, error);
  }
};
exports.getListUpdateHeweDB = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    // const adminId = loginAdmin._id;

    let { limit, page, keyword, sortBy } = matchedData(req);
    let condition = { status: { $ne: "extend" } };

    if (keyword) {
      condition = {
        ...condition,
        $or: [{ userName: { $regex: keyword, $options: "i" } }, { email: { $regex: keyword, $options: "i" } }],
      };
    }

    let sort = { createdAt: -1 }; // mặc định sắp xếp theo ngày tạo mới nhất
    if (sortBy) {
      if (sortBy === "newest") sort = { createdAt: -1 };
      else if (sortBy === "oldest") sort = { createdAt: 1 };
    }

    const startIndex = (page - 1) * limit;
    let data = await TransactionUpdateLog.find(condition).sort(sort).skip(startIndex).limit(limit);
    let total = await TransactionUpdateLog.find(condition).countDocuments();

  

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getHeweDBData = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword, sortBy } = matchedData(req);
    let condition = { status: { $ne: "extend" } };

    if (keyword) {
      condition = {
        ...condition,
        $or: [{ userName: { $regex: keyword, $options: "i" } }, { userEmail: { $regex: keyword, $options: "i" } }],
      };
    }

    let sort = { createdAt: -1 }; // mặc định sắp xếp theo ngày tạo mới nhất
    if (sortBy) {
      if (sortBy === "newest") sort = { createdAt: -1 };
      else if (sortBy === "oldest") sort = { createdAt: 1 };
    }

    const startIndex = (page - 1) * limit;
    let data = await TRANSACTION_HEWEDB.find(condition).sort(sort).skip(startIndex).limit(limit);
    let total = await TRANSACTION_HEWEDB.find(condition).countDocuments();

    let resultData = [];
    for (let record of data) {
      // tìm trong lịch sử gửi mail lấy thông tin email đã gửi
      let emailRecord = await MAIL_HISTORY.findOne({ transactionId: record._id });

      if (emailRecord) {
        resultData.push({ ...record._doc, emailRecord });
      } else {
        resultData.push({ ...record._doc, emailRecord: null });
      }
    }

    success(res, "OK", { array: resultData, total });
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

exports.getHeweDBData_F1User = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId } = matchedData(req);

    // tìm tất cả F1 của userId
    let f1Array = await getF1(userId);
    let f1TransactionArray = [];
    for (let user of f1Array) {
      // xét từng F1 tìm tất cả giao dịch của họ (trừ giao dịch extend)
      // lấy tất cả không phân trang

      let f1Id = user.referredUser_id;
      let condition = { status: { $ne: "extend" }, userId: f1Id };
      const data = await TRANSACTION_HEWEDB.find(condition).sort({ createdAt: -1 });
      f1TransactionArray = [...f1TransactionArray, ...data];
    }

    success(res, "OK", f1TransactionArray);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getHeweDBData_User = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId } = matchedData(req);

    let condition = { status: { $ne: "extend" }, userId: userId };
    const data = await TRANSACTION_HEWEDB.find(condition).sort({ createdAt: -1 });

    success(res, "OK", data);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.adminGetCommissionPercentage = async (req, res) => {
  try {
    let data = (await CONFIG_VALUE.findOne({ configKey: "commissionPercent" }))?.configValue;
    success(res, "OK", data);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.adminUpdateCommissionPercentage = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { newValue } = matchedData(req);
    await CONFIG_VALUE.updateOne({ configKey: "commissionPercent" }, { configValue: newValue });
    success(res, "Updated successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getProfileUserId = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { userId } = matchedData(req);
    const userData = await USER.findOne({ _id: userId });

    // get list F1
    let f1Array = await getF1(userId);
    let f1ArrayData = [];
    for (let f1 of f1Array) {
      // lấy thông tin chi tiết
      let f1Data = await USER.findOne({ _id: f1.referredUser_id });
      // kiểm tra số lượng F1 (để làm cây network)
      let childCount = (await getF1(f1.referredUser_id)).length;
      f1Data = { ...f1Data._doc, childCount };
      f1ArrayData.push(f1Data);
    }

    // get thông tin người giới thiệu
    let parentData = null;
    let refData = await REFERRAL.findOne({ user_id: userId });
    if (refData) {
      let parentId = refData?.referredBy;
      if (parentId) {
        parentData = await USER.findOne({ _id: parentId });
      }
    }

    success(res, "OK", { userData, f1ArrayData, parentData });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDetailUserList = async (req, res) => {
  // lấy chi tiết các danh sách của một user
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    const { userId, list, limit, page } = matchedData(req);
    const userData = await USER.findOne({ _id: userId });
    if (!userData) return error_400(res, "User not found");

    let model = null;
    if (list == "deposit") model = DEPOSIT;
    else if (list == "withdrawUSDT") model = WITHDRAW;
    else if (list == "withdrawHEWE") model = WITHDRAW_HEWE;
    else if (list == "withdrawAMC") model = WITHDRAW_AMC;
    else if (list == "buyTokenAPI") model = BUY_TOKEN_V2;
    else if (list == "buyTokenConnectWallet") model = BUY_TOKEN_V2;
    else if (list == "depositHEWE") model = DEPOSIT_HEWE;
    else if (list == "depositAMC") model = DEPOSIT_AMC;

    let condition = null;
    if (list == "deposit")
      condition = { userId }; // amountAfter: { $ne: -99 } nếu chỉ muốn lấy các giao dịch đã xác nhận thì thêm đk này
    else if (list == "withdrawUSDT") condition = { userId };
    else if (list == "withdrawHEWE") condition = { userId };
    else if (list == "withdrawAMC") condition = { userId };
    else if (list == "buyTokenAPI") condition = { userId, transactionHash: null };
    else if (list == "buyTokenConnectWallet") condition = { userId, transactionHash: { $ne: null } };
    else if (list == "depositHEWE") condition = { userId };
    else if (list == "depositAMC") condition = { userId };

    const startIndex = (page - 1) * limit;
    const data = await model.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await model.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getConfigValue = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { configKey } = matchedData(req);
    let data = (await CONFIG_VALUE.findOne({ configKey }))?.configValueString;

    success(res, "OK", data);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.updateConfigValue = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { configKey, configValue } = matchedData(req);
    await CONFIG_VALUE.updateOne({ configKey }, { configValueString: configValue });

    success(res, "OK", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.setUserBalance = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId, token, amount } = matchedData(req);

    const userData = await USER.findOne({ _id: userId });
    if (!userData) return error_400(res, "User not found");

    let field = token === "hewedeposit" ? "heweDeposit" : `${token}Balance`; // heweDeposit, heweBalance, usdtBalance, amcBalance
    // tăng thêm amount vào field // amount có thể âm nghĩa là trừ
    await USER.updateOne({ _id: userId }, { $inc: { [field]: amount } });

    let userAfter = await USER.findOne({ _id: userId });

    // lưu lịch sử
    let logData = {
      adminId,
      userId,
      token,
      amount,
      before: userData[field],
      after: userAfter[field],
    };

    await LOG.create({
      type: "",
      data: JSON.stringify(logData),
      userId,
      token,
      amount,
      userName: userData.name,
      userEmail: userData.email,
    });

    success(res, "Updated successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getHistorySetUserBalance = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword, token } = matchedData(req);

    let condition = { token };
    if (keyword) {
      condition = {
        ...condition,
        $or: [{ userName: { $regex: keyword, $options: "i" } }, { userEmail: { $regex: keyword, $options: "i" } }],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await LOG.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await LOG.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

const calcPercentBonus = (amountUSDT) => {
  if (amountUSDT && amountUSDT >= 5000) return 0.01; // 1%
  else return 0;
};

exports.adminSellToken = async (req, res) => {
  // cập nhật 14/8/2024: tính phí 0.05% USDT khi mua AMC
  // cập nhật 27/9/2024: có lại bonus, chỉ áp dụng cho hewe khi mua bằng point hệ thống, không áp dụng swap ví
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId, amountUSDT, token } = matchedData(req);

    // find user
    const userData = await USER.findOne({ _id: userId });
    if (!userData) return error_400(res, "User not found");

    const HEWE_RATE = (await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue || 0;
    const AMC_RATE = (await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue || 0;

    // check balance USDT
    // không cần kiểm tra số dư USDT, admin bán cho user admin tự quản lý số dư
    // if (userData.usdtBalance < amountUSDT) return error_400(res, "Insufficient balance USDT");

    if (token === "hewe") {
      let amountHEWE = amountUSDT / HEWE_RATE;
      let percentBonus = calcPercentBonus(amountUSDT);
      let amountBonus = (amountUSDT * percentBonus) / HEWE_RATE; // mua HEWE bonus HEWE

      // cộng HEWE (bao gồm cả amount thực và amount bonus), lên lịch sử giao dịch, KHÔNG TRỪ USDT
      await USER.updateOne(
        { _id: userId },
        {
          $inc: { heweBalance: amountHEWE + amountBonus },
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
        type: "adminSellToken", // để phân biệt với user tự mua
        adminId,
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
      await addRevenue(userId, amountUSDT, userData, x);

      success(res, "Sell HEWE successfully", { amountUSDT, amountHEWE, amountBonus });
    } else if (token === "amc") {
      let feePercent = 0.0005;
      let feeAmount = amountUSDT * feePercent;

      let amountAMC = (amountUSDT - feeAmount) / AMC_RATE;
      let percentBonus = calcPercentBonus(amountUSDT);
      let amountBonus = (amountUSDT * percentBonus) / AMC_RATE; // mua AMC bonus AMC

      // cộng AMC, lên lịch sử giao dịch, KHÔNG TRỪ USDT
      await USER.updateOne(
        { _id: userId },
        {
          $inc: { amcBalance: amountAMC + amountBonus },
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
        type: "adminSellToken", // để phân biệt với user tự mua
        adminId,
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
      await addRevenue(userId, amountUSDT, userData, x);

      success(res, "Sell AMC successfully", { amountUSDT, amountAMC, amountBonus });
    } else return error_400(res, "Token not found", 1);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.searchUserByKeyword = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { keyword } = matchedData(req);
    let condition = {
      $or: [{ name: { $regex: keyword, $options: "i" } }, { email: { $regex: keyword, $options: "i" } }],
    };
    let data = await USER.find(condition).skip(0).limit(10); // chỉ giới hạn 10 kết quả

    success(res, "OK", data);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getHistoryRevenue = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword, timeStart, timeEnd } = matchedData(req);

    const startDate = new Date(timeStart);
    const endDate = new Date(timeEnd);

    let condition = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (keyword) {
      condition = {
        ...condition,
        $or: [
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
          { revenueUserEmail: { $regex: keyword, $options: "i" } },
          { revenueUserName: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    let startIndex = (page - 1) * limit;
    let data = await REVENUE.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    let total = await REVENUE.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.adminGetPool = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { pool } = matchedData(req);
    let configKey = pool === "hewe" ? "poolHewe" : "poolUsdt";

    let poolValue = (await CONFIG_VALUE.findOne({ configKey: configKey }))?.configValue;

    success(res, "OK", { poolValue });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.adminUpdatePool = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { pool, amount } = matchedData(req);
    let configKey = pool === "hewe" ? "poolHewe" : "poolUsdt";

    await CONFIG_VALUE.updateOne({ configKey }, { configValue: amount });

    success(res, "OK", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.extractKey = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;
    const adminEmail = loginAdmin.email;

    // quan trọng: chỉ admin mới dùng được hàm này
    if (adminEmail !== "movado68@yahoo.com") return error_400(res, "Access denied", 1);

    let { userId, type } = matchedData(req);

    let w = await WALLET_USER.findOne({ userId: userId, code: type });
    if (!w) return error_400(res, "Data not found", 1);

    let result = {
      address: w.address,
      privateKey: w.privateKey,
    };

    success(res, "OK", result);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.searchWalletUser = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { address } = matchedData(req);

    let w = await WALLET_USER.findOne({ address });
    if (!w) return error_400(res, "Data not found", 1);

    let result = {
      userEmail: w.userEmail,
      userId: w.userId,
    };

    success(res, "OK", result);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getHistoryUpdateAddress = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword } = matchedData(req);

    let condition = {};

    if (keyword) {
      condition = {
        ...condition,
        $or: [
          { userName: { $regex: keyword, $options: "i" } },
          { userEmail: { $regex: keyword, $options: "i" } },
          { oldAddress: { $regex: keyword, $options: "i" } },
          { newAddress: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    let startIndex = (page - 1) * limit;
    let data = await HISTORY_UPDATE_WALLET.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    let total = await HISTORY_UPDATE_WALLET.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

const findParent = async (userId) => {
  // hàm tìm tuyến trên của userId
  // input: userId
  // output: parentId nếu tìm thấy, null nếu không tìm thấy

  let refData = await REFERRAL.findOne({ user_id: userId });
  if (refData && refData.referredBy) {
    return refData.referredBy.toString();
  } else {
    // không tìm thấy người giới thiệu thì return null
    return null;
  }
};

const findParentRecursive = async (userId, resultArray) => {
  // tìm tuyến trên của userId
  let parentId = await findParent(userId);
  if (parentId) {
    // nếu tìm thấy thì đẩy vào mảng và tìm tiếp tuyến trên của parentId
    resultArray.push(parentId);
    return await findParentRecursive(parentId, resultArray);
  } else {
    return resultArray;
  }
};

exports.changeBranch = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId, newParentId } = matchedData(req);

    // lấy mảng các tuyến trên của newParentId và kiểm tra xem userId có trong mảng không
    // nếu có nghĩa là userId là tuyến trên của newParentId, không thể chuyển vì sẽ tạo ra vòng tròn
    let toTestArray = [];
    let data = await findParentRecursive(newParentId, toTestArray);

    if (data.includes(userId)) return error_400(res, "Không thể thực hiện thay đổi này", 1);

    // b1: tìm tuyến trên cũ của userId
    let oldParentId = await findParent(userId);
    if (oldParentId) {
      // xóa userId khỏi mảng referredTo của oldParentId
      await REFERRAL.updateOne({ user_id: oldParentId }, { $pull: { referredTo: { referredUser_id: userId } } });
    }

    // b2: thêm userId vào mảng referredTo của newParentId
    await REFERRAL.updateOne(
      { user_id: newParentId },
      {
        $push: { referredTo: { referredUser_id: userId } },
      }
    );

    // b3: cập nhật referredBy của userId
    await REFERRAL.updateOne({ user_id: userId }, { referredBy: newParentId });

    // lưu lịch sử
    let oldParentEmail = (await USER.findOne({ _id: oldParentId }))?.email;
    let newParentEmail = (await USER.findOne({ _id: newParentId }))?.email;
    let userEmail = (await USER.findOne({ _id: userId }))?.email;

    await BRANCH_HISTORY.create({
      userId,
      userEmail,
      oldParentId,
      oldParentEmail,
      newParentId,
      newParentEmail,
    });

    success(res, "Đã thay đổi", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.addDataConfigValue = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { configKey, configValueString } = matchedData(req);

    // check xem configKey đã tồn tại chưa
    let check = await CONFIG_VALUE.findOne({ configKey });
    if (check) return error_400(res, "configKey đã tồn tại", 1);

    await CONFIG_VALUE.create({ configKey, configValueString });

    success(res, "OK", { configKey, configValueString });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getDataConfigValue = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { configKey } = matchedData(req);

    let result = await getDataConfigValueFn(configKey);
    if (!result) return error_400(res, "Data not found", 1);

    success(res, "OK", result);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.verifyEmailUser = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { userId } = matchedData(req);
    const userData = await USER.findOne({ _id: userId });
    if (!userData) return error_400(res, "User not found", 1);

    // nếu đã xác thực rồi thì thôi
    if (userData.isOtpVerified) return error_400(res, "This user is already verified by email", 1);

    await USER.updateOne({ _id: userId }, { isOtpVerified: true });

    success(res, "Verified successfully", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getSwap2025List = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { limit, page, keyword, type } = matchedData(req);

    let condition = {};

    if (type) {
      // hiện có 2 loại: "USDT(BEP20)=>AMC(AMC20)", "AMC(AMC20)=>AMC(BEP20)"
      condition = { ...condition, type };
    }

    if (keyword) {
      // tìm theo fromAddress1 (địa chỉ ví user chuyển tiền) hoặc txHash1 (hash giao dịch user đã chuyển tiền)
      condition = {
        ...condition,
        $or: [{ fromAddress1: { $regex: keyword, $options: "i" } }, { txHash1: { $regex: keyword, $options: "i" } }],
      };
    }

    const startIndex = (page - 1) * limit;
    const data = await HOMEPAGE_SWAP.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const total = await HOMEPAGE_SWAP.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.markSwap2025Transaction = async (req, res) => {
  try {
    const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;

    let { id, action, transactionHash } = matchedData(req);

    // kiểm tra id tồn tại, phải là type "AMC(AMC20)=>AMC(BEP20)", status là "pending"
    const transactionData = await HOMEPAGE_SWAP.findOne({ _id: id, type: "AMC(AMC20)=>AMC(BEP20)", status: "pending" });
    if (!transactionData) return error_400(res, "Transaction not found or already processed");

    // api này chỉ cập nhật trạng thái thôi đánh dấu để admin biết thôi, không cần làm gì khác
    // lưu log
    // cập nhật 29/5/2025: lưu thêm transactionHash khi duyệt approve

    const log = {
      adminId,
      time: Date.now(),
    };

    if (!transactionHash) transactionHash = "";

    if (action === "approve") {
      await HOMEPAGE_SWAP.updateOne(
        { _id: id },
        { status: "approved", logData: JSON.stringify(log), txHash2: transactionHash }
      );
    } else if (action === "reject") {
      await HOMEPAGE_SWAP.updateOne({ _id: id }, { status: "rejected", logData: JSON.stringify(log) });
    } else {
      return error_400(res, "Invalid action", 1);
    }

    success(res, "Updated", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.crawOneBlock = async (req, res) => {
  try {
    let { blockNumber } = matchedData(req);

    await getEventContractOnlyOneBlock2025(blockNumber);

    success(res, "Done", true);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};
