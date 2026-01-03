const mongoose = require("mongoose");

const historyUpdateWalletSchema = new mongoose.Schema(
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
    oldAddress: { type: String },
    newAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("historyUpdateWallet", historyUpdateWalletSchema);
