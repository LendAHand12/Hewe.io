const redis = require("redis");

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
  legacyMode: true,
});

client.on("error", (error) => {
  console.error("Redis error", error);
});

client.on("connect", () => {
  console.log("Redis connected");
});

module.exports = client;
