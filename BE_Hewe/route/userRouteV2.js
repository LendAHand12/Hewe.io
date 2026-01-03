const express = require("express");
const router = express.Router();
const VERIFY_USER = require("../middleware/authMiddleware");
const {
  buyTokenV2,
  getBuyTokenV2History,
  commissionV2History,
  buyTokenV2Wallet,
  createTransactionHeweDB,
  getTransactionHeweDB,
  completeTransactionHeweDB,
  extendTransactionHeweDB,
  getConfigPrice,
  getTreeByUserId,
  getTransactionHeweDB_F1User,
	getDepositHeweAddress,
	getPrices,
	extendHeweDB2025,
} = require("../controller/user/newUserController");
const { query, body } = require("express-validator");
const { handleValidationErrors } = require("../middleware/handleValidationErrors");
const { recaptcha } = require("../middleware/recaptcha");
const { limiter } = require("../middleware/rateLimit");
const {
  getSwapRate,
  getChart,
  getWalletPoolAddress,
  getPublicHistoryTransactionChart,
  getTransactionByHash,
} = require("../controller/chart");
const { arrayPeriodsLabel } = require("../constants/index");
const { spinRedisHeweDb } = require("../middleware/redis");

router.post(
  "/buyTokenV2",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("amountUSDT")
    .exists()
    .notEmpty()
    .isNumeric()
    .toFloat()
    .custom((value) => value > 0),
  body("token")
    .exists()
    .notEmpty()
    .custom((value) => ["hewe", "amc"].includes(value)),
  handleValidationErrors,
  buyTokenV2
);

router.get(
  "/buyTokenV2History",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("type")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .custom((value) => ["api", "connectWallet"].includes(value)),
  handleValidationErrors,
  getBuyTokenV2History
);

router.get(
  "/commissionV2History",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  commissionV2History
);

router.post(
  // api này cho bên thứ 3 gọi khi user mua token bằng cách kết nối ví // không cần verify token
  // khi bên đó nhận được giao dịch thì gọi api này -> bên đây lưu giao dịch, cộng hoa hồng
  "/buyTokenV2Wallet",
  body("address").exists().notEmpty().trim().isEthereumAddress(),
  body("amount")
    .exists()
    .notEmpty()
    .isNumeric()
    .toFloat()
    .custom((value) => value > 0),
  body("tokenBuy")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .custom((value) => ["hewe", "amc"].includes(value.toLowerCase())),
  body("transactionHash").exists().notEmpty().trim(),
  handleValidationErrors,
  buyTokenV2Wallet
);

router.post(
  "/createTransactionHeweDB",
  VERIFY_USER.verifyUserToken,
  body("usdt")
    .exists()
    .notEmpty()
    .isNumeric()
    .toFloat()
    .custom((value) => value >= 500),
  body("percent")
    .exists()
    .notEmpty()
    .isNumeric()
    .toFloat()
    .custom((value) => value >= 10 && value <= 30),
  body("year")
    .exists()
    .notEmpty()
    .isInt()
    .toInt()
    .custom((value) => value >= 1 && value <= 2),
  handleValidationErrors,
  recaptcha,
  spinRedisHeweDb,
  createTransactionHeweDB
);

router.get(
  "/getTransactionHeweDB",
  VERIFY_USER.verifyUserToken,
  query("limit")
    .exists()
    .notEmpty()
    .isInt()
    .toInt()
    .custom((value) => value > 0),
  query("page")
    .exists()
    .notEmpty()
    .isInt()
    .toInt()
    .custom((value) => value > 0),
  handleValidationErrors,
  getTransactionHeweDB
);

router.get(
  // user lấy danh sách heweDB của user F1
  "/getTransactionHeweDB_F1User",
  VERIFY_USER.verifyUserToken,
  getTransactionHeweDB_F1User
);

router.post(
  "/completeTransactionHeweDB",
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("transactionId").exists().notEmpty().isString().trim(),
  handleValidationErrors,
  completeTransactionHeweDB
);

router.post(
  "/extendTransactionHeweDB",
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("transactionId").exists().notEmpty().isString().trim(),
  body("year")
    .exists()
    .notEmpty()
    .isInt()
    .toInt()
    .custom((value) => value >= 1 && value <= 2),
  handleValidationErrors,
  // extendTransactionHeweDB
  extendHeweDB2025
);

router.get(
  "/getConfigPrice",
  query("token")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .toLowerCase()
    .custom((value) => ["hewe", "amc"].includes(value)),
  handleValidationErrors,
  getConfigPrice
);

// cây hệ thống
router.get(
  "/getTreeByUserId",
  VERIFY_USER.verifyUserToken,
  query("userId").exists().notEmpty().isString().trim(),
	 handleValidationErrors,
  getTreeByUserId
);

// chart
router.get("/getSwapRate", VERIFY_USER.verifyUserToken, getSwapRate);
router.get("/getWalletPoolAddress", VERIFY_USER.verifyUserToken, getWalletPoolAddress);
router.get(
  "/getChart",
  query("period")
    .exists()
    .notEmpty()
    .custom((value) => arrayPeriodsLabel.includes(value)),
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
	query("token").optional().isString(), // hewe thì không cần truyền, nếu amc thì truyền amc
  handleValidationErrors,
  getChart
);

router.get(
  "/getPublicHistoryTransactionChart", // lấy lịch sử giao dịch chart
  // API này public, giao dịch trên blockchain nên ai cũng xem được
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  query("timeStart").exists().notEmpty().isInt().toInt(),
  query("timeEnd").exists().notEmpty().isInt().toInt(),
  handleValidationErrors,
  getPublicHistoryTransactionChart
);

router.get(
  "/getTransactionByHash", // api cho bên thứ 3 gọi, cung cấp hash để lấy giao dịch txChart
  // API này public
  query("transactionHash").exists().notEmpty().isString().trim(),
  handleValidationErrors,
  getTransactionByHash
);

router.get("/getDepositHeweAddress", VERIFY_USER.verifyUserToken, getDepositHeweAddress);

router.get(
  "/getPrices", // api public lấy giá token
  getPrices
);

module.exports = router;
