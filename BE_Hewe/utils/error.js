const { delRedis } = require("../database/model.redis");

const status = {
  OK: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,
  InternalServerError: 500,
  verifyEmailId: 901,
  emailAlreadyExists: 902,
};

const error_400 = (res, message, e) => {
  return res.status(status.BadRequest).json({
    message,
    errors: e,
    status: false,
  });
};

const error_400_delRedis = async (res, message, e, keyName) => {
  // delete key redis trước khi trả về lỗi 400
  await delRedis(keyName);

  return res.status(status.BadRequest).json({
    message,
    errors: e,
    status: false,
  });
};

const error_500 = (res, e) => {
  return res.status(status.InternalServerError).json({
    message: "Something went wrong! Please try again later.",
    errors: null,
    status: false,
  });
};

const success = (res, message, data) => {
  return res.status(status.OK).json({
    message,
    data,
    status: true,
  });
};

module.exports = {
  status,
  error_400,
  error_400_delRedis,
  error_500,
  success,
};
