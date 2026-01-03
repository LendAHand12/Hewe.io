const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
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
    method: {
      type: String,
    },
    address: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    amountReceive: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    timestamp: {
      type: String,
    },
    logData: {
      type: String,
    },
    transactionHash: {
      type: String,
    },
    timeAdminApproved: {
      type: Date,
    },
    adminLogData: {
      type: String,
    },
    timeAdminRejected: {
      type: Date,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("withdraw", withdrawSchema);
