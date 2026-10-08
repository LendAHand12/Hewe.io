const mongoose = require("mongoose");

// yêu cầu ngưng HEWE DB (ký quỹ) sớm của user
// luồng: pending -> approved (admin nhập lãi) -> completed (admin đã trả lãi xong)
//        pending -> rejected
const heweDBStopRequestSchema = new mongoose.Schema(
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
    heweDbId: {
      type: mongoose.Schema.Types.ObjectId, // _id của giao dịch trong bảng transactionDb
      ref: "transactionDb",
    },
    transactionId: {
      type: String, // transactionId (uuid) của giao dịch
    },
    // snapshot lúc user gửi yêu cầu, để admin tham khảo khi tính lãi
    hewe: { type: Number, default: 0 },
    amc: { type: Number, default: 0 },
    receivedUSDT: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    startTime: { type: Date },
    endTime: { type: Date },
    reason: {
      type: String, // lý do user nhập
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    interestUSDT: {
      type: Number, // lãi admin tự tính và trả riêng cho user
      default: 0,
    },
    adminNote: {
      type: String,
      default: "",
    },
    rejectReason: {
      type: String,
      default: "",
    },
    transactionHash: {
      type: String, // mã giao dịch / ghi chú admin đã chuyển lãi (không bắt buộc)
      default: "",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId },
    completedBy: { type: mongoose.Schema.Types.ObjectId },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("heweDBStopRequest", heweDBStopRequestSchema);
