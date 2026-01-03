const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    access_token: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("session", sessionSchema);
