const mongoose = require("mongoose");

const TransactionHistorySchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    amount_hewe: {
      type: Number,
      default: 0,
    },
    amount_usd: {
      type: Number,
      default: 0,
    },
    hash: {
      type: String,
    },
    referredBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    rewardPriceReferrer: {
      type: Number,
      default: 0,
    },
    rewardHeweToReferrer: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransactionHistory", TransactionHistorySchema);
