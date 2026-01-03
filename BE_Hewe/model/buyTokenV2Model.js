const mongoose = require("mongoose");

// mua token v2 (3/7/2024)

const buyTokenV2Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      allowNull: true,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    tokenBuy: { type: String }, // mua hewe hoặc amc
    tokenBonus: { type: String }, // mua hewe bonus amc hoặc ngược lại
    amountUSDT: {
      type: Number,
      default: 0,
    },
    amountHewe: {
      type: Number,
      default: 0,
    },
    amountAmc: {
      type: Number,
      default: 0,
    },
    amountBonus: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "success",
    },
    timestamp: {
      type: String,
    },
    logData: {
      type: String,
    },
    transactionHash: {
      type: String,
      allowNull: true,
      default: null, // khi mua token bằng kết nối ví, bên t3 gửi data về thì lưu hash // còn mua bằng điểm hệ thống thì không có hash
    },
    address: {
      type: String,
      allowNull: true,
      default: null, // khi mua token bằng kết nối ví, bên t3 gửi data về thì lưu address // còn mua bằng điểm hệ thống thì không có address
    },
	  feePercent: {
      type: Number,
      default: 0,
    },
    feeAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("buyTokenV2", buyTokenV2Schema);
