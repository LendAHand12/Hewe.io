const mongoose = require("mongoose");

const homepageSwapSchema = new mongoose.Schema(
  {
    fromAddress1: { type: String },
    toAddress1: { type: String },
    token1: { type: String }, // 1 là giao dịch user chuyển // 2 là giao dịch user nhận
    amount1: { type: Number },
    txHash1: { type: String },
    time1: { type: String }, // thời gian cào được giao dịch 1
    rate: { type: Number }, // tỷ giá qui đổi
    token2: { type: String }, // 1 là giao dịch user chuyển // 2 là giao dịch user nhận
    amount2: { type: Number },
    fromAddress2: { type: String },
    toAddress2: { type: String },
    txHash2: { type: String },
    status: { type: String },
    logData: { type: String },
    type: { type: String }, // hiện có 2 loại: USDT(BEP20)=>AMC(AMC20) và AMC(AMC20)=>AMC(BEP20)
  },
  { timestamps: true }
);

module.exports = mongoose.model("homepageSwap", homepageSwapSchema);
