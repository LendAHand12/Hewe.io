const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["ADMIN", "SUBADMIN"],
    },
    access_module: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accessModule",
      },
    ],
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permission",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);
