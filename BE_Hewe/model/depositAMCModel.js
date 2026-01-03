const mongoose = require("mongoose");

const depositAMCSchema = new mongoose.Schema(
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
    transactionHash: { type: String },
    category: { type: String },
    coinKey: { type: String },
    amount: { type: Number, default: 0 },
    address: { type: String },
    amountBefore: { type: Number, default: 0 },
    amountAfter: { type: Number, default: 0 },
    logData: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("depositAMC", depositAMCSchema);
