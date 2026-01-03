const mongoose = require("mongoose");

const chart2Schema = new mongoose.Schema(
  {
    period: {
      type: String, // 1m, 3m, 5m,...
    },
    symbol: {
      type: String,
      default: "AMCUSDT",
    },
    open: {
      type: Number,
    },
    close: {
      type: Number,
    },
    high: {
      type: Number,
    },
    low: {
      type: Number,
    },
    timestamp: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chart2", chart2Schema);
