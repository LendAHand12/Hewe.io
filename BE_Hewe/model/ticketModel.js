const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
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
    subject: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
    },
    closedByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticket", ticketSchema);
