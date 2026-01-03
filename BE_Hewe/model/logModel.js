const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    data: {
      type: String,
    },
    userId: {
      type: String,
    },
    token: {
      type: String,
    },
    amount: {
      type: Number,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("log", logSchema);
