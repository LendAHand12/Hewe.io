const mongoose = require("mongoose");

const depositHEWESchema = new mongoose.Schema(
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
    transactionHash: { type: String }, // hash của giao dịch cào được từ blockchain
    fromAddress: { type: String }, // địa chỉ gửi
    toAddress: { type: String }, // địa chỉ nhận
    amount: { type: Number, default: 0 },
    logData: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("depositHEWE", depositHEWESchema);
