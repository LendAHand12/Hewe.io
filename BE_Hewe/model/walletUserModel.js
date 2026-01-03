const mongoose = require("mongoose");

const walletUserSchema = new mongoose.Schema(
  {
    address: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
    },
    code: {
      type: String,
    },
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
    privateKey: {
      type: String,
    },
    publicKey: {
      type: String,
    },
    hex: { type: String },
    type: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("walletUser", walletUserSchema);
