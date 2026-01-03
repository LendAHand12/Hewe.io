const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
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
    commissionUserLevel: { type: Number },
    commissionUserWalletAddress: { type: String },
    transactionId: { type: String },
    amountUSDT: { type: Number, default: 0 },
    amountHEWE: { type: Number, default: 0 },
    status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
    transactionHash: { type: String },
    timeAdminApproved: { type: Date },
    adminLogData: { type: String },
    reason: { type: String },
    timeAdminRejected: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("commission", commissionSchema);
