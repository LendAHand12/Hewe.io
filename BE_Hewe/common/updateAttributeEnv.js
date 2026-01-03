const fs = require("fs");

const updateAttributeEnv = function (envPath, attrName, newVal) {
  var dataArray = fs.readFileSync(envPath, "utf8").split("\n");

  var replacedArray = dataArray.map((line) => {
    if (line.split("=")[0] == attrName) {
      return attrName + "=" + String(newVal);
    } else {
      return line;
    }
  });

  fs.writeFileSync(envPath, "");

  for (let i = 0; i < replacedArray.length - 1; i++) {
    fs.appendFileSync(envPath, replacedArray[i] + `\n`);
  }
};

const saveConfig = (lastBlock) => {
  updateAttributeEnv(`.env`, `LAST_BLOCK`, lastBlock);
};

module.exports = { saveConfig };
