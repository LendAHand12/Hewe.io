const mongoose = require("mongoose");

// chức năng mua bằng VND

const buyTransactionHistorySchema = new mongoose.Schema(
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
    amountHewe: {
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
    amountVnd: {
      type: Number,
      default: 0,
    },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bank",
    },
    bankData: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "userConfirmed", "userCanceled", "adminConfirmed", "adminRejected"],
      default: "pending",
    },
    timestamp: {
      type: String,
    },
    billImage: {
      type: String,
    },
    timeUserConfirmed: {
      type: Date,
    },
    timeUserCanceled: {
      type: Date,
    },
    timeAdminConfirmed: {
      type: Date,
    },
    timeAdminRejected: {
      type: Date,
    },
    logData: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("buyTransactionHistory", buyTransactionHistorySchema);
