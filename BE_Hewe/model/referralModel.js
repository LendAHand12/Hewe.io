const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    referralLink: {
      type: String,
    },
    referralCode: {
      type: String,
    },
    ReceivedPrice: {
      type: Number,
      default: 0,
    },
    ReceivedHewePrice: {
      type: Number,
      default: 0,
    },
    referredTo: [
      {
        referredUser_id: {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    referredBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("referral", referralSchema);
