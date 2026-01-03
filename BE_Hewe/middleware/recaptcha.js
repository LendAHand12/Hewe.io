const { error_400 } = require("../utils/error");
require("dotenv").config();
const axios = require("axios");

const recaptcha = async (req, res, next) => {
  // frontend sẽ xử lý xác thực recaptcha trước, sau đó có token truyền lên
  // server sẽ xác thực lại với google, nếu ok mới thực hiện api

  const response_key = req.body.gRec;
  if (!response_key) return error_400(res, "Invalid request");

  // default gRec key để test
  if (response_key == "hewehewe") return next();

  // verify với google
  const secret_key = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

  const google_response = await axios.request({
    method: "post",
    maxBodyLength: Infinity,
    url,
  });

  if (google_response?.data?.success == true) {
    // xác thực recaptcha thành công
    next();
  } else return error_400(res, "Invalid request");
};

module.exports = { recaptcha };
