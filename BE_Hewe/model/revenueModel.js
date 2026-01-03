const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userEmail: { type: String }, // user thực hiện giao dịch
    userName: { type: String },
    revenueUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    revenueUserEmail: { type: String }, // user được cộng doanh số
    revenueUserName: { type: String },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
    }, // giao dịch phát sinh doanh số
    amountUSDT: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("revenue", revenueSchema);
