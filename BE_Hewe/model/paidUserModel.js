const mongoose = require("mongoose");

const paidUserSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    totalPaid_USDT: {
      type: Number,
      default: 0,
    },
    transactionHash_USDT: {
      type: String,
    },
    totalPaid_HEWE: {
      type: Number,
      default: 0,
    },
    transactionHash_HEWE: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("paidUser", paidUserSchema);
