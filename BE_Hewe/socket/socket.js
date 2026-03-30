const CHART = require("../model/chartModel");
const CHART_2 = require("../model/chart2Model");
const CONFIG_VALUE = require("../model/configValueModel");
const { arrayPeriodsLabel } = require("../constants/index");
const { getPriceFromAPI, getPriceHeweFromAPI } = require("../module/socketXT");

const getLastCandle = async (period) => {
  return await CHART.findOne({ period }).sort({ createdAt: -1 });
};

const getLastCandleChart2 = async (period) => {
  return await CHART_2.findOne({ period }).sort({ createdAt: -1 });
};

const getPoolPrice = async () => {
  let poolHewe = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;
  let poolUsdt = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  return { poolHewe, poolUsdt };
};

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // cache giá mới nhất để mỗi lần emit luôn gửi đủ cả hai
  let cachedAMC = 0;
  let cachedHEWE = 0;

  // lấy giá AMC từ PancakeSwap mỗi 10 giây, lưu vào DB
  setInterval(async () => {
    let price = Number(await getPriceFromAPI()) || 0;
    console.log(`[AMC] ${new Date().toISOString()} - price: ${price}`);
    if (price > 0) {
      cachedAMC = price;
      await CONFIG_VALUE.updateOne({ configKey: "amcPrice" }, { configValue: price });
    }

    io.emit("newPrice", { priceAMC: cachedAMC, priceHEWE: cachedHEWE });
    // giữ lại socket priceAMC như trước để tránh lỗi
    io.emit("priceAMC", cachedAMC);
  }, 10000);

  // lấy giá HEWE từ LBK mỗi 5 giây, lưu vào DB
  setInterval(async () => {
    let price = Number(await getPriceHeweFromAPI()) || 0;
    console.log(`[HEWE] ${new Date().toISOString()} - price: ${price}`);
    if (price > 0) {
      cachedHEWE = price;
      await CONFIG_VALUE.updateOne({ configKey: "hewePrice" }, { configValue: price });
    }

    io.emit("newPrice", { priceAMC: cachedAMC, priceHEWE: cachedHEWE });
  }, 5000);
};

module.exports = { setupSocket };
