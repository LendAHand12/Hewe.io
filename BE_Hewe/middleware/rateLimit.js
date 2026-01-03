const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 3 * 1000, // 3 seconds
  max: 1,
});

module.exports = { limiter };
