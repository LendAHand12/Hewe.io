const mongoose = require("mongoose");

const TransactionUpdateLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  transactionId: { type: mongoose.Types.ObjectId, required: true, ref: "TRANSACTION_HEWEDB" },
  oldEndTime: { type: Date, required: true },
  newEndTime: { type: Date, required: true },
  oldBalance: { type: Number, required: true },
  newBalance: { type: Number, required: true },
  diffBalance: { type: Number, required: true },
  yearsAdded: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TransactionUpdateLog", TransactionUpdateLogSchema);
