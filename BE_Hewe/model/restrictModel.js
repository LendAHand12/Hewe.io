const mongoose = require("mongoose");

const restrictSchema = new mongoose.Schema(
  {
    address: {
      type: String, // địa chỉ ví đã mở khoá
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("restrict", restrictSchema);
