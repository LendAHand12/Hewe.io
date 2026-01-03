const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    permission: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("permission", permissionSchema);
