const mongoose = require("mongoose");

const ticketMessageSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket",
    },
    senderType: {
      type: String,
      enum: ["user", "admin"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    senderName: {
      type: String,
    },
    message: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticketMessage", ticketMessageSchema);
