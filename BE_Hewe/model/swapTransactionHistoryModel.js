const mongoose = require("mongoose");

const swapTransactionHistorySchema = new mongoose.Schema(
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
    fromToken: {
      type: String,
      default: "USDT",
    },
    toToken: {
      type: String,
      default: "HEWE",
    },
    amountFrom: {
      type: Number,
      default: 0,
    },
    amountTo: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    fee: {
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

module.exports = mongoose.model("swapTransactionHistory", swapTransactionHistorySchema);
