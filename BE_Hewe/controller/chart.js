const CONFIG_VALUE = require("../model/configValueModel");
const CHART = require("../model/chartModel");
const CHART_2 = require("../model/chart2Model");
const TX_CHART = require("../model/txChartModel");
const { success, error_500, error_400 } = require("../utils/error");
const { matchedData } = require("express-validator");
const { arrayPeriods } = require("../constants/index");
const { getPriceFromAPI, getPriceHeweFromAPI } = require("../module/socketXT");
const { getPricePancake } = require("../module/pancake");
const { writeLogUpdatePrices } = require("../module/log");

const calcSwapRate = async () => {
  let poolHewe = (await CONFIG_VALUE.findOne({ configKey: "poolHewe" })).configValue;
  let poolUsdt = (await CONFIG_VALUE.findOne({ configKey: "poolUsdt" })).configValue;
  let price = poolUsdt / poolHewe;
  return price;
};

const getLastCandle = async (periodLabel) => {
  return await CHART.findOne({ period: periodLabel }).sort({ createdAt: -1 });
};

const getLastCandleChart2 = async (periodLabel) => {
  return await CHART_2.findOne({ period: periodLabel }).sort({ createdAt: -1 });
};

exports.getSwapRate = async (req, res) => {
  try {
    let swapRate = await calcSwapRate();
    success(res, "OK", { swapRate });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.cronChart = async () => {
  try {
    // hàm này chạy theo cronjob
    // tìm xem có record trước đó của mốc thời gian đó không
    // nếu không có -> tạo record mới
    // nếu có -> kiểm tra thời gian
    // nếu còn trong thời gian của mốc -> update record trước
    // nếu hết thời gian của mốc -> tạo record mới
	  
	  // cập nhật 17/9/2024: do phần chart hewe (theo kiểu pool) không còn sử dụng nữa nên bỏ không chạy hàm này nữa
    return;

    let swapRate = await calcSwapRate();
    let now = new Date().getTime();
    let nowRound = Math.floor(now / 60000) * 60000; // làm tròn xuống 1 phút gần nhất

    for (let period of arrayPeriods) {
      let lastCandle = await getLastCandle(period.label);

      if (!lastCandle) {
        await CHART.create({
          period: period.label,
          open: swapRate,
          close: swapRate,
          high: swapRate,
          low: swapRate,
          timestamp: nowRound,
        });
      } else {
        let lastTime = new Date(lastCandle.createdAt).getTime();
        let diff = now - lastTime;
        if (diff < period.value) {
          // còn thời gian -> update
          // open: chỉ lấy 1 lần đầu tiên
          // close: là giá hiện tại
          // high: nếu giá hiện tại lớn hơn high thì gán high = giá hiện tại
          // low: nếu giá hiện tại nhỏ hơn low thì gán low = giá hiện tại
          let newHigh = Math.max(swapRate, lastCandle.high);
          let newLow = Math.min(swapRate, lastCandle.low);
          await CHART.updateOne({ _id: lastCandle._id }, { close: swapRate, high: newHigh, low: newLow });
        } else {
          // hết thời gian -> tạo record mới
          // open: bằng giá close của record trước
          // close: giá hiện tại
          // high: giá cao nhất giữa open và close
          // low: giá thấp nhất giữa open và close
          await CHART.create({
            period: period.label,
            open: lastCandle.close,
            close: swapRate,
            high: Math.max(swapRate, lastCandle.close),
            low: Math.min(swapRate, lastCandle.close),
            timestamp: nowRound,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

function roundTo8Decimals(num) {
  return Math.round(num * 1e8) / 1e8;
}

exports.cronChart2 = async () => {
  try {
    // let price = Number(await getPriceFromAPI());
    // let price = 0.24;
    let price = await getPricePancake();
    if (price && price > 0) {
      await CONFIG_VALUE.updateOne({ configKey: "amcPrice" }, { configValue: roundTo8Decimals(price) });
    }

    // lấy giá HEWE từ sàn coinstore cập nhật vào db
    // nếu API lỗi hoặc không lấy được (null) thì thôi không cập nhật, giữ nguyên giá cũ
    let hewePrice = await getPriceHeweFromAPI();
    if (hewePrice) {
      await CONFIG_VALUE.updateOne({ configKey: "hewePrice" }, { configValue: hewePrice });
    }
	  
	  // ghi lại log cập nhật giá
    await writeLogUpdatePrices(
      `Cron chart 2: AMC price = ${price}, HEWE price = ${hewePrice}, time = ${new Date().toISOString()}`
    );

    // cập nhật 17/9/2024: do phần chart AMC không còn sử dụng nữa nên bỏ không chạy hàm này nữa
    return;

    let now = new Date().getTime();
    let nowRound = Math.floor(now / 60000) * 60000; // làm tròn xuống 1 phút gần nhất

    for (let period of arrayPeriods) {
      let lastCandle = await getLastCandleChart2(period.label);

      if (!lastCandle) {
        await CHART_2.create({
          period: period.label,
          open: price,
          close: price,
          high: price,
          low: price,
          timestamp: nowRound,
        });
      } else {
        let lastTime = new Date(lastCandle.createdAt).getTime();
        let diff = now - lastTime;
        if (diff < period.value) {
          // còn thời gian -> update // logic giống chart cũ
          let newHigh = Math.max(price, lastCandle.high);
          let newLow = Math.min(price, lastCandle.low);
          await CHART_2.updateOne({ _id: lastCandle._id }, { close: price, high: newHigh, low: newLow });
        } else {
          // hết thời gian -> tạo record mới
          await CHART_2.create({
            period: period.label,
            open: lastCandle.close,
            close: price,
            high: Math.max(price, lastCandle.close),
            low: Math.min(price, lastCandle.close),
            timestamp: nowRound,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getChart = async (req, res) => {
  try {
    let { period, limit, page, token } = matchedData(req);

    let startIndex = (page - 1) * limit;
    let condition = { period };

    let data, total;
    if (token && token == "AMC") {
      data = await CHART_2.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
      total = await CHART_2.find(condition).countDocuments();
    } else {
      // mặc định là hewe chart 1
      data = await CHART.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
      total = await CHART.find(condition).countDocuments();
    }

    success(res, "OK", { array: data.reverse(), total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getWalletPoolAddress = async (req, res) => {
  try {
    let walletBuy = (await CONFIG_VALUE.findOne({ configKey: "walletpoolUsdt" }))?.configValueString;
    let walletSell = (await CONFIG_VALUE.findOne({ configKey: "walletpoolHewe" }))?.configValueString;

    success(res, "OK", { walletBuy, walletSell });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getPublicHistoryTransactionChart = async (req, res) => {
  // API public lấy lịch sử giao dịch chart
  try {
    let { limit, page, keyword, timeStart, timeEnd } = matchedData(req);

    const startDate = new Date(timeStart);
    const endDate = new Date(timeEnd);

    let condition = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (keyword) {
      condition = {
        ...condition,
        $or: [
          { sendAddress: { $regex: keyword, $options: "i" } },
          { receiveAddress: { $regex: keyword, $options: "i" } },
          { transactionHash: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    let startIndex = (page - 1) * limit;
    let data = await TX_CHART.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    let total = await TX_CHART.find(condition).countDocuments();

    success(res, "OK", { array: data, total });
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};

exports.getTransactionByHash = async (req, res) => {
  try {
    let { transactionHash } = matchedData(req);

    let data = await TX_CHART.findOne({ transactionHash });
    if (!data) {
      return error_400(res, "Transaction not found", 1);
    }

    let result = {
      ...data._doc,
      logData: undefined,
    };

    success(res, "Get transaction successfully", result);
  } catch (error) {
    console.log(error);
    error_500(res, error);
  }
};
