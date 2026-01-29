const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    LAH_member: {
      type: String,
    },
    verifyLAH: {
      type: Boolean,
      default: false,
    },
    totalPaid_USDT: {
      type: Number,
      default: 0,
    },
    totalPaid_HEWE: {
      type: Number,
      default: 0,
    },
    otp: {
      type: Number,
    },
    otpTime: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    transactionStatus: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    usdtBalance: {
      type: Number,
      default: 0,
    },
    heweBalance: {
      type: Number,
      default: 0,
    },
    amcBalance: {
      type: Number,
      default: 0,
    },
    walletAddress: {
      type: String,
    },
    timeWalletAddress: {
      type: Date,
    },
    level: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    revenueF1: {
      type: Number,
      default: 0,
    }, // doanh thu từ F1 trực tiếp của user // khác với revenue ở trên là doanh thu toàn hệ thống
    // Two-Factor Authentication fields
    twoFactorSecret: {
      type: String,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    heweDeposit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
