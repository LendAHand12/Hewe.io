const mongoose = require("mongoose");

const commissionV2Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userEmail: { type: String },
    commissionUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    commissionUserEmail: { type: String },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    amountTokenCommission: { type: Number },
    tokenCommission: { type: String },
    amountUSDTBuy: { type: Number },
	typeCommission: { type: String, default: "" }, // loại hoa hồng // chuỗi rỗng là hoa hồng từ các giao dịch mua token
    // "hewedb" là hoa hồng phát sinh từ việc gia hạn giao dịch hewedb
	// cập nhật 25/11/2024: thêm type "hewedb_creation": hoa hồng phát sinh từ việc tạo mới giao dịch hewedb
  },
  { timestamps: true }
);

module.exports = mongoose.model("commissionV2", commissionV2Schema);
