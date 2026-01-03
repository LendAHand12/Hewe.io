const mongoose = require("mongoose");

// mua gói bằng cách kết nối ví

const buyPackageByConnectWalletSchema = new mongoose.Schema(
  {
    transactionHash: {
      type: String, // hash giao dịch bên thứ 3 gửi về
    },
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

module.exports = mongoose.model("buyPackageByConnectWallet", buyPackageByConnectWalletSchema);
