const client = require("./redis");

const getRedis = async (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const delRedis = async (key) => {
  return new Promise((resolve, reject) => {
    client.del(key, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const setRedis = async (key, count) => {
  console.log(client, "??", key, count);
  return new Promise((resolve, reject) => {
    client.set(key, count, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const incrbyRedis = async (key, count) => {
  return new Promise((resolve, reject) => {
    client.incrby(key, count, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const decrbyRedis = async (key, count) => {
  return new Promise((resolve, reject) => {
    client.decrby(key, count, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const existsRedis = async (key) => {
  return new Promise((resolve, reject) => {
    client.exists(key, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const setnxRedis = async (key, count) => {
  return new Promise((resolve, reject) => {
    client.setnx(key, count, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const delRedisAll = async () => {
  return new Promise((resolve, reject) => {
    client.flushall((err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  getRedis,
  setRedis,
  incrbyRedis,
  existsRedis,
  setnxRedis,
  decrbyRedis,
  delRedis,
  delRedisAll,
};
