const mongoose = require("mongoose");

// mua gói bằng USDT

const buyPackageByUsdtSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    packageName: { type: String },
    packageData: { type: String }, // package data tại thời điểm mua
    amountUSDT: {
      type: Number,
      default: 0,
    },
    amountHewe: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("buyPackageByUsdt", buyPackageByUsdtSchema);
