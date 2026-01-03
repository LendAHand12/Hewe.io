const CONFIG_VALUE = require("../model/configValueModel");

const getDataConfigValueFn = async (configKey) => {
  try {
    let data = await CONFIG_VALUE.findOne({ configKey });

    if (data) {
      return data.configValueString.toString();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { getDataConfigValueFn };
