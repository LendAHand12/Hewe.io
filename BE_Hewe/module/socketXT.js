const WebSocket = require("ws");
const url = "wss://stream.xt.com/public";
const { default: axios } = require("axios");

const CHART_2 = require("../model/chart2Model");

// const socket = new WebSocket(url, {
//   headers: {
//     "Sec-WebSocket-Extensions": "permessage-deflate",
//   },
// });

// function subscribeToChannel() {
//   const subscribeMessage = JSON.stringify({
//     method: "subscribe",
//     params: ["kline@amc_usdt,1m"],
//   });
//   socket.send(subscribeMessage);
// }

// socket.on("open", () => {
//   subscribeToChannel();
// });

// socket.on("message", async (data) => {
//   console.log(data, "message");
//   let bufferData = data; // data trả về từ server là buffer
//   let stringData = bufferData.toString(); // chuyển buffer thành string
//   let objectData = JSON.parse(stringData); // chuyển string thành object
//   let realData = objectData.data;

//   console.log(realData);

//   if (realData) {
//     await CHART_2.create({
//       period: "1m",
//       open: realData.o,
//       close: realData.c,
//       high: realData.h,
//       low: realData.l,
//       timestamp: realData.t,
//     });
//   }
// });

let lastStablePrice = 0;

const getPriceFromAPI = async () => {
  try {
    let res = await axios.get("https://sapi.xt.com/v4/public/ticker/price?symbol=amc_usdt");
    if (res && res.data && res.data.result && res.data.result[0]) {
      let price = res.data.result[0].p;
      // console.log("🚀 ~ getPriceFromAPI ~ price:", price);
      lastStablePrice = price; // khi lấy được giá thì gán lại cho lastStablePrice để khi api lỗi thì sẽ trả về giá cũ chứ không phải 0
      return price;
    } else {
      // return 0;
      return lastStablePrice;
    }
  } catch (error) {
    console.log(error);
    // return 0;
    return lastStablePrice;
  }
};

const getPriceHeweFromAPI = async () => {
  try {
    // let response = await axios.get("https://api.coinstore.com/api/v1/ticker/price");
    // let heweItem = response?.data?.data?.find((item) => item.symbol == "HEWEUSDT");
    // if (heweItem) return Number(heweItem.price);
    // else return null;
    let response = await axios.get("https://api.lbkex.com/v2/supplement/ticker/price.do?symbol=hewe_usdt");
    let heweItem = response?.data?.data[0];
    if (heweItem) {
      // console.log("🚀 ~ getPriceHeweFromAPI ~ heweItem:", Number(heweItem.price));
      return Number(heweItem.price);
    } else return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { getPriceFromAPI, getPriceHeweFromAPI };
