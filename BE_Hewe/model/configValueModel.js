const mongoose = require("mongoose");

const configValueSchema = new mongoose.Schema({
  configKey: {
    type: String,
  },
  configValue: {
    type: Number,
    default: 0,
  },
	configValueString: {
    type: String,
  },
});

module.exports = mongoose.model("configValue", configValueSchema);
