const mongoose = require("mongoose");

const txChartSchema = new mongoose.Schema(
  {
    type: {
      type: String, // "buy" or "sell"
    },
    sendAddress: {
      type: String,
    },
    receiveAddress: {
      type: String,
    },
    receiveToken: {
      type: String,
    },
    transactionHash: {
      type: String,
    },
    amountUsdt: {
      type: Number,
    },
    amountHewe: {
      type: Number,
    },
    price: {
      type: Number, // tỉ giá tại thời điểm giao dịch
    },
    status: {
      type: String,
    },
    logData: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("txChart", txChartSchema);
