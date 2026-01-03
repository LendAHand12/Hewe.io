const CHART = require("../model/chartModel");
const CHART_2 = require("../model/chart2Model");
const CONFIG_VALUE = require("../model/configValueModel");
const { arrayPeriodsLabel } = require("../constants/index");
const { getPriceFromAPI } = require("../module/socketXT");

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

  setInterval(async () => {
    // let arr = [];
    // for (let period of arrayPeriodsLabel) {
    //   let lastCandle = await getLastCandle(period);
    //   arr.push(lastCandle);
    // }
    // io.emit("chartData", arr);

    // let pool = await getPoolPrice();
    // io.emit("pool", pool);

    // let arr2 = [];
    // for (let period of arrayPeriodsLabel) {
    //   let lastCandle = await getLastCandleChart2(period);
    //   arr2.push(lastCandle);
    // }
    // io.emit("chartDataAMC", arr2);

    let priceAMC = Number((await CONFIG_VALUE.findOne({ configKey: "amcPrice" }))?.configValue);
    let priceHEWE = Number((await CONFIG_VALUE.findOne({ configKey: "hewePrice" }))?.configValue);

    io.emit("newPrice", { priceAMC, priceHEWE });

    // giữ lại socket priceAMC như trước để tránh lỗi
    io.emit("priceAMC", priceAMC);
  }, 1000);
};

module.exports = { setupSocket };
