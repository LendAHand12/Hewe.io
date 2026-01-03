const fs = require("fs/promises");

async function writeLog(logData) {
  if (!logData) {
    return;
  }

  try {
    await fs.appendFile("log.txt", logData + "\n\n\n");
  } catch (err) {
    console.error("Failed to write log:", err);
  }
}

async function writeLogTransferAMC(logData) {
  if (!logData) {
    return;
  }

  try {
    await fs.appendFile("logAMC.txt", logData + "\n\n\n");
  } catch (err) {
    console.error("Failed to write log:", err);
  }
}

async function writeLogUpdatePrices(logData) {
  if (!logData) return;

  try {
    await fs.appendFile("logUpdatePrices.txt", logData + "\n");
  } catch (err) {
    console.error("Failed to write log:", err);
  }
}

async function writeLogSendMail(logData) {
  if (!logData) return;

  try {
    await fs.appendFile("logSendMail.txt", logData + "\n");
  } catch (err) {
    console.error("Failed to write log:", err);
  }
}

module.exports = { writeLog, writeLogTransferAMC, writeLogUpdatePrices, writeLogSendMail };