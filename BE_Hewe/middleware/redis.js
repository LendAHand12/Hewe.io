const { existsRedis, setnxRedis, getRedis, incrbyRedis } = require("../database/model.redis");
const { error_400 } = require("../utils/error");

const SERVICE_NAME = "heweio";

const spinRedisHeweDb = async (req, res, next) => {
  const userData = req.user;
  const userId = userData._id;
  const keyName = `${userId}${SERVICE_NAME}spinRedisHeweDb`;
  const getKey = await existsRedis(keyName);
  if (!getKey) await setnxRedis(keyName, 0);
  let flagWallet = await getRedis(keyName);
  flagWallet = await incrbyRedis(keyName, 1);
  req.body.keyName = keyName;

  if (flagWallet > 1) return error_400(res, "The system is processing, please wait for a moment");
  next();
};

module.exports = {
  spinRedisHeweDb,
};
