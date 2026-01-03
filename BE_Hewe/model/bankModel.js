const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
    },
    bankAccountNumber: {
      type: String,
    },
    bankAccountOwner: {
      type: String,
    },
    bankImage: {
      type: String,
    },
    bankCode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bank", bankSchema);
