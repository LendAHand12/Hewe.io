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

  /*
  // ==========================================
  // [CODE GỐC - LẤY GIÁ AMC TỪ PANCAKESWAP]
  // ==========================================
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
  */

  // ==========================================
  // [HIỆN TẠI - DÙNG GIÁ AMC DO ADMIN SET CỨNG]
  // ==========================================
  // lấy giá AMC từ DB (giá do admin set) mỗi 10 giây
  setInterval(async () => {
    try {
      let amcConfig = await CONFIG_VALUE.findOne({ configKey: "amcPrice" });
      let price = amcConfig ? Number(amcConfig.configValue) || 0 : 0;
      console.log(`[AMC - Admin Price] ${new Date().toISOString()} - price: ${price}`);
      if (price > 0) {
        cachedAMC = price;
      }

      io.emit("newPrice", { priceAMC: cachedAMC, priceHEWE: cachedHEWE });
      // giữ lại socket priceAMC như trước để tránh lỗi
      io.emit("priceAMC", cachedAMC);
    } catch (error) {
      console.log("Error in AMC socket interval:", error);
    }
  }, 10000);

  // lấy giá HEWE từ LBK mỗi 5 giây, lưu vào DB
  setInterval(async () => {
    try {
      let price = Number(await getPriceHeweFromAPI()) || 0;
      console.log(`[HEWE] ${new Date().toISOString()} - price: ${price}`);
      if (price > 0) {
        cachedHEWE = price;
        await CONFIG_VALUE.updateOne({ configKey: "hewePrice" }, { configValue: price });
      }

      // Đảm bảo cachedAMC có giá trị từ DB nếu chưa được nạp
      if (cachedAMC === 0) {
        let amcConfig = await CONFIG_VALUE.findOne({ configKey: "amcPrice" });
        if (amcConfig && Number(amcConfig.configValue)) {
          cachedAMC = Number(amcConfig.configValue);
        }
      }

      io.emit("newPrice", { priceAMC: cachedAMC, priceHEWE: cachedHEWE });
    } catch (error) {
      console.log("Error in HEWE socket interval:", error);
    }
  }, 5000);
};

module.exports = { setupSocket };
