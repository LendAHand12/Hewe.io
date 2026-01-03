const REFERRAL = require("../model/referralModel");
const COMMISSION = require("../model/commissionModel");
const COMMISSION_V2 = require("../model/commissionV2Model");
const CONFIG_VALUE = require("../model/configValueModel");
const USER = require("../model/userModel");
const REVENUE = require("../model/revenueModel");
const TRANSACTION_HEWEDB = require("../model/transactionDbModel");

const addCommission = async (userId, userData, x, amountUSDT, amountHEWE) => {
  // userId là user thực hiện giao dịch // tìm người giới thiệu của user này
  // amountUSDT là số USDT mà user mua
  // amountHEWE là số HEWE mà user mua
  // x là giao dịch tạo ra

  const refData = await REFERRAL.findOne({ user_id: userId });
  if (refData) {
    let refUserId = refData.referredBy; // id của người giới thiệu
    const userRef = await USER.findOne({ _id: refUserId }); // người giới thiệu
    const userRefLevel = userRef.level;

    if (userRef && userRefLevel === 1) {
      // hoa hồng là 5% số USDT mà user mua
      await COMMISSION.create({
        userId,
        userEmail: userData.email,
        commissionUserId: userRef._id,
        commissionUserEmail: userRef.email,
        commissionUserLevel: 1,
        commissionUserWalletAddress: userRef.walletAddress,
        transactionId: x._id,
        amountUSDT: amountUSDT * 0.05,
        amountHEWE: 0,
      });
    } else if (userRef && userRefLevel === 2) {
      // hoa hồng là 10% số USDT mà user mua và 5% số HEWE
      await COMMISSION.create({
        userId,
        userEmail: userData.email,
        commissionUserId: userRef._id,
        commissionUserEmail: userRef.email,
        commissionUserLevel: 2,
        commissionUserWalletAddress: userRef.walletAddress,
        transactionId: x._id,
        amountUSDT: amountUSDT * 0.1,
        amountHEWE: 0,
      });
      await COMMISSION.create({
        userId,
        userEmail: userData.email,
        commissionUserId: userRef._id,
        commissionUserEmail: userRef.email,
        commissionUserLevel: 2,
        commissionUserWalletAddress: userRef.walletAddress,
        transactionId: x._id,
        amountUSDT: 0,
        amountHEWE: amountHEWE * 0.05,
      });
    }
  }
};

const findReferral = async (userId) => {
  // tìm tuyến trên (người giới thiệu) của userId
  // output: data của tuyến trên || null
  try {
    const refData = await REFERRAL.findOne({ user_id: userId });
    if (!refData) return null;

    let refUserId = refData.referredBy; // id của người giới thiệu
    const userRef = await USER.findOne({ _id: refUserId }); // người giới thiệu
    if (!userRef) return null;

    return userRef;
  } catch (error) {
    return null;
  }
};

const addCommissionV2 = async (userId, userData, amountUSDT, x, type = "") => {
  // userId là user thực hiện giao dịch // tìm người giới thiệu của user này
  // không cần quan tâm user mua token nào, tất cả đều tính hoa hồng bằng tỉ lệ phần trăm của số USDT mà user mua
  // x là giao dịch mua
  // cập nhật 9/7/2024: lấy phần trăm từ database
  // cập nhật 30/11/2024: cố định 5% cho tuyến trên và 1% cho tuyến trên nữa

  try {
    const userRef = await findReferral(userId);
    if (!userRef) return;

    let amountCommission = amountUSDT * 0.05;

    // cộng cho người giới thiệu
    // update 9/8/2024: người giới thiệu (tuyến trên trực tiếp của user mua token) sẽ được cộng doanh thu F1 trực tiếp vào cột revenueF1, số cộng là amountUSDT
    await USER.updateOne({ _id: userRef._id }, { $inc: { usdtBalance: amountCommission, revenueF1: amountUSDT } });

    await COMMISSION_V2.create({
      userId,
      userEmail: userData.email,
      commissionUserId: userRef._id,
      commissionUserEmail: userRef.email,
      transactionId: x._id,
      amountTokenCommission: amountCommission,
      tokenCommission: "USDT",
      amountUSDTBuy: amountUSDT,
      typeCommission: type,
    });

    // tìm người giới thiệu tuyến trên nữa
    const userRefF0 = await findReferral(userRef._id);
    if (!userRefF0) return;

    let amountCommissionF0 = amountUSDT * 0.01;

    await USER.updateOne({ _id: userRefF0._id }, { $inc: { usdtBalance: amountCommissionF0 } });

    await COMMISSION_V2.create({
      userId,
      userEmail: userData.email,
      commissionUserId: userRefF0._id,
      commissionUserEmail: userRefF0.email,
      transactionId: x._id,
      amountTokenCommission: amountCommissionF0,
      tokenCommission: "USDT",
      amountUSDTBuy: amountUSDT,
      typeCommission: type,
    });
  } catch (error) {}
};

const updateLevelWhenBuyPackage = async (userId, userData, packageData) => {
  // nếu user mua gói 1 hoặc 2 thì cập nhật lên level 1 với điều kiện trước đó level < 1
  if ((packageData.id == 1 || packageData.id == 2) && userData.level < 1) {
    await USER.updateOne({ _id: userId }, { $set: { level: 1 } });
  }

  // nếu user mua gói 3,4,5,6 thì cập nhật lên level 2 với điều kiện trước đó level < 2
  if (
    (packageData.id == 3 || packageData.id == 4 || packageData.id == 5 || packageData.id == 6) &&
    userData.level < 2
  ) {
    await USER.updateOne({ _id: userId }, { $set: { level: 2 } });
  }
};

const addRevenue = async (userId, amountUSDT, transactionUser, transactionId) => {
  // userId là user mua token
  // cộng doanh số cho tuyến trên lên tới các tầng trên luôn, doanh số là số USDT mà user mua
  // update 5/8/2024: có lưu lịch sử doanh số
  // transactionUser là thực hiện giao dịch ban đầu, không thay đổi qua mỗi lần đệ quy
  // transactionId là id của giao dịch mua token, không thay đổi qua mỗi lần đệ quy

  try {
    if (!userId) return;
    if (!amountUSDT) return;

    amountUSDT = Number(amountUSDT);

    const refData = await REFERRAL.findOne({ user_id: userId });
    if (refData) {
      let refUserId = refData.referredBy; // id của người giới thiệu
      const userRef = await USER.findOne({ _id: refUserId }); // người giới thiệu

      if (userRef) {
        // cộng doanh số
        await USER.updateOne({ _id: refUserId }, { $inc: { revenue: amountUSDT } });

        // lưu lịch sử doanh số
        await REVENUE.create({
          userId: transactionUser?._id,
          userEmail: transactionUser?.email || "", // chỗ này lưu user xuất phát thực hiện giao dịch chứ không phải user trong đệ quy
          userName: transactionUser?.name || "",
          revenueUserId: userRef._id,
          revenueUserEmail: userRef.email,
          revenueUserName: userRef.name,
          transactionId: transactionId,
          amountUSDT: amountUSDT,
        });

        // đệ quy lên tầng trên
        await addRevenue(userRef._id, amountUSDT, transactionUser, transactionId);
      }
    }
  } catch (error) {}
};

const addCommissionV2_extendHeweDB = async (userId, userData, amountUSDT, x, type = "") => {
  // đây là hoa hồng khi gia hạn giao dịch ký quỹ
  // userId là user thực hiện gia hạn -> tuyến trên của userId sẽ nhận hoa hồng 0.5% USDT

  try {
    const userRef = await findReferral(userId);
    if (!userRef) return;

    let amountCommission = amountUSDT * 0.005;

    await USER.updateOne({ _id: userRef._id }, { $inc: { usdtBalance: amountCommission } });

    await COMMISSION_V2.create({
      userId,
      userEmail: userData.email,
      commissionUserId: userRef._id,
      commissionUserEmail: userRef.email,
      transactionId: x._id,
      amountTokenCommission: amountCommission,
      tokenCommission: "USDT",
      amountUSDTBuy: amountUSDT,
      typeCommission: type,
    });
  } catch (error) {}
};

module.exports = {
  addCommission,
  updateLevelWhenBuyPackage,
  addCommissionV2,
  addRevenue,
  addCommissionV2_extendHeweDB,
};
