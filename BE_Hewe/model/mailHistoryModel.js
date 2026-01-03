const mongoose = require("mongoose");

// lịch sử gửi mail cảnh báo 3 ngày nữa sẽ hết hạn hewedb

const mailHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    transactionId: { type: mongoose.Schema.Types.ObjectId }, // id giao dịch hewedb
    fromMail: { type: String },
    toMail: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("mailHistory", mailHistorySchema);
