const mongoose = require("mongoose");

const transactionDbSchema = new mongoose.Schema(
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
    transactionId: {
      type: String,
    },
    type: {
      type: String, // tạo mới hoặc gia hạn
      enum: ["new", "extend"],
    },
    previousTransactionId: {
      type: String, // nếu tạo mới -> null // nếu gia hạn -> id của giao dịch trước
      allowNull: true,
    },
    hewe: {
      type: Number, // số hewe thực hiện giao dịch
      default: 0,
    },
    priceHewe: {
      type: Number, // giá hewe tại thời điểm giao dịch
      default: 0,
    },
    usdthewe: {
      type: Number, // số usdt thực hiện giao dịch hewe
      default: 0,
    },
    amc: {
      type: Number, // số amc thực hiện giao dịch
      default: 0,
    },
    priceAmc: {
      type: Number, // giá amc tại thời điểm giao dịch
      default: 0,
    },
    usdtamc: {
      type: Number, // số usdt thực hiện giao dịch amc
      default: 0,
    },
    receivedUSDT: {
      type: Number, // số usdt user nhận lúc tạo giao dịch // tính theo percent từ usdt
      default: 0,
    },
    percent: {
      type: Number,
      default: 0,
    },
    periodDays: {
      type: Number,
      default: 365, // 1 năm
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["inprocess", "completed", "extend"], // inprocess, completed (hết chu kỳ kết thúc luôn), extend (hết chu kỳ gia hạn thêm)
      default: "inprocess",
    },
    logData: {
      type: String,
    },
    logData2: {
      type: String,
      default: "",
    },
	  diff: {
      type: Number, // chênh lệch giữa newReceivedUSDT và receivedUSDT ban đầu
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transactionDb", transactionDbSchema);
