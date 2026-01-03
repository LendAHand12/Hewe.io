const TelegramBot = require("node-telegram-bot-api");

const botToken = "8356869451:AAEofeJduCV0MKqiZ5nAvraEj8PTFjnNLD4";

const bot = new TelegramBot(botToken, { polling: false });

const sendTelegramMessageToChannel = async (message, channelId = "-1002800653305") => {
  try {
    // if (!channelId) return;
    // if (channelId.charAt(0) !== "@") channelId = "@" + channelId;

    await bot.sendMessage(channelId, message);
    console.log("Message sent to channel");
  } catch (error) {
    console.log("Error sending message to channel", error);
  }
};

module.exports = { sendTelegramMessageToChannel };
