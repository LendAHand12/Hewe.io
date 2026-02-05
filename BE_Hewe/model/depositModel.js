const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
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
    transactionHash: { type: String },
    category: { type: String },
    coinKey: { type: String },
    amount: { type: Number, default: 0 },
    address: { type: String },
    amountBefore: { type: Number, default: 0 },
    amountAfter: { type: Number, default: 0 },
    logData: {
      type: String,
    },
    // Web3 Deposit fields
    depositType: { type: String, enum: ["coinpayments", "web3"], default: "coinpayments" },
    fromAddress: { type: String }, // Địa chỉ ví gửi tiền (user wallet)
    toAddress: { type: String }, // Địa chỉ ví nhận tiền (system wallet)
    blockNumber: { type: Number }, // Block number của transaction
    gasUsed: { type: String }, // Gas đã sử dụng
  },
  { timestamps: true }
);

module.exports = mongoose.model("deposit", depositSchema);
