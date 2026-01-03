const mongoose = require("mongoose");

const access_moduleSchema = new mongoose.Schema(
  {
    access_module: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("accessModule", access_moduleSchema);
