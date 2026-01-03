const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userEmail: {
      type: String,
    },
    oldParentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    oldParentEmail: {
      type: String,
    },
    newParentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    newParentEmail: {
      type: String,
    },
    status: {
      type: String,
      default: "success",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("branch", branchSchema);
