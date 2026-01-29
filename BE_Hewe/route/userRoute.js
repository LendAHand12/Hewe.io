const express = require("express");
const router = express.Router();
const userAuthController = require("../controller/user/authController");
const twoFactorController = require("../controller/user/twoFactorController");
const BlogController = require("../controller/admin/blogController");
const uploadController = require("../controller/user/uploadController");
const message = require("../middleware/validationError");
const validation = require("../validation/userValidation");
const VERIFY_USER = require("../middleware/authMiddleware");
const {
  createWallet,
  getProfile,
  getSwapConfig,
  swap,
  getSwapHistory,
  buyHeweByVND,
  confirmBuyHeweByVND,
  checkTransactionBeforeUpload,
  cancelBuyHeweByVND,
  checkTransaction,
  getBuyHeweByVNDHistory,
  getBankList,
  withdrawUSDT,
  getWithdrawUSDTHistory,
  withdrawHEWE,
  getWithdrawHeweHistory,
  updateUSDTBalance,
  getDepositHistory,
  addDataToDatabase,
  buyPackageHeweByUSDT,
  getHistoryBuyPackageHeweByUSDT,
  updateWalletAddressUser,
  getCommissionHistoryUser,
  buyPackageConnectWallet,
  withdrawAMC,
  getWithdrawAmcHistory,
  testTelegram,
  getDepositAMCHistory,
  addDataToDatabaseReve,
  getDepositHEWEHistory,
  checkUserHeweDB,
} = require("../controller/user/newUserController");
const { query, body } = require("express-validator");
const { handleValidationErrors } = require("../middleware/handleValidationErrors");
const { isValidObjectId } = require("mongoose");
const { recaptcha } = require("../middleware/recaptcha");
const { limiter } = require("../middleware/rateLimit");
const { getListPackage } = require("../data/listPackage");

router.post("/signUp", userAuthController.signUp);
router.post("/login", validation.LoginValidate, message.errorResponse, userAuthController.login);
router.post(
  "/otpVerification",
  validation.VerifyOtpValidation,
  message.errorResponse,
  userAuthController.otpVerification
);
router.post("/sendOTP", validation.SendOtpValidation, message.errorResponse, userAuthController.sendOTP);
router.post("/forgotPassword", userAuthController.forgotPassword);
router.put("/setNewPassword", validation.setPasswordValidation, userAuthController.setNewPassword);
router.put("/changePassword", VERIFY_USER.verifyUserToken, userAuthController.changePassword);

// 2FA Management
router.post("/setup2FA", VERIFY_USER.verifyUserToken, twoFactorController.setup2FA);
router.post("/verify2FA", VERIFY_USER.verifyUserToken, twoFactorController.verify2FA);
router.post("/disable2FA", VERIFY_USER.verifyUserToken, twoFactorController.disable2FA);
router.get("/get2FAStatus", VERIFY_USER.verifyUserToken, twoFactorController.get2FAStatus);

router.get("/getTransaction", userAuthController.getTransaction);
router.get("/getTotalReward", userAuthController.getTotalReward);
router.post("/TokenTransactionHistroy", userAuthController.TokenTransactionHistroy);
router.get("/getTokenTransactionHistory", userAuthController.getTokenTransactionHistory);
router.get("/getAllReferrals", userAuthController.getAllReferrals);
router.post("/contactUs", userAuthController.contactUs);
router.post("/upload-file", uploadController.fileUpload);

///////////////////////
///////////////////////
router.get("/getProfile", VERIFY_USER.verifyUserToken, getProfile);

router.get("/getBlog/:id", BlogController.getBlog);
router.get("/getAllBlogs", BlogController.getAllBlogs);

///////////////////////
///////////////////////
router.post(
  "/createWallet",
  VERIFY_USER.verifyUserToken,
  body("symbol")
    .exists()
    .notEmpty()
    .custom((value) => value === "USDT.ERC20" || value === "USDT.TRC20" || value === "USDT.BEP20"),
  handleValidationErrors,
  createWallet
);
router.post(
  // api này cho bên thứ 3 gọi để cập nhật số dư USDT // không cần verify token
  "/updateUSDTBalance",
  body("address").exists().notEmpty().trim(),
  body("txn_id").exists().notEmpty().trim(),
  body("currency").exists().notEmpty().trim(),
  body("amount").exists().notEmpty(),
  handleValidationErrors,
  updateUSDTBalance
);
router.get(
  "/getDepositHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getDepositHistory
);

router.get(
  "/getDepositAMCHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getDepositAMCHistory
);

router.get(
  "/getDepositHEWEHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getDepositHEWEHistory
);

///////////////////////
///////////////////////
router.get("/getSwapConfig", VERIFY_USER.verifyUserToken, getSwapConfig);
router.post(
  "/swap",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("amountUSDT")
    .exists()
    .notEmpty()
    .isNumeric()
    .custom((value) => value > 0)
    .toFloat(),
  handleValidationErrors,
  swap
);
router.get(
  "/getSwapHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getSwapHistory
);

///////////////////////
///////////////////////
router.post(
  "/buyHeweByVND",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("amountHEWE")
    .exists()
    .notEmpty()
    .isNumeric()
    .toInt()
    .custom((value) => value > 0),
  body("idBank")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  handleValidationErrors,
  buyHeweByVND
);
router.post(
  "/confirmBuyHeweByVND",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  handleValidationErrors,
  checkTransactionBeforeUpload,
  uploadController.imageUpload,
  confirmBuyHeweByVND
);
router.post(
  "/cancelBuyHeweByVND",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  handleValidationErrors,
  cancelBuyHeweByVND
);
router.post("/checkTransaction", VERIFY_USER.verifyUserToken, checkTransaction);
router.get(
  "/getBuyHeweByVNDHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getBuyHeweByVNDHistory
);
router.get("/getBankList", VERIFY_USER.verifyUserToken, getBankList);

///////////////////////
///////////////////////
router.post(
  "/withdrawUSDT",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("method")
    .exists()
    .notEmpty()
    .custom((value) => value === "BEP20" || value === "ERC20" || value === "TRC20"),
  body("address").exists().notEmpty(),
  body("amount")
    .exists()
    .notEmpty()
    .isNumeric()
    .custom((value) => value > 0)
    .toFloat(),
  handleValidationErrors,
  withdrawUSDT
);
router.get(
  "/getWithdrawUSDTHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getWithdrawUSDTHistory
);

///////////////////////
// rút HEWE - AMC // lịch sử
///////////////////////
router.post(
  "/withdrawHEWE",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("method")
    .exists()
    .notEmpty()
    .custom((value) => value === "AMC20"),
  body("address").exists().notEmpty(),
  body("amount")
    .exists()
    .notEmpty()
    .isNumeric()
    .custom((value) => value > 0)
    .toFloat(),
  handleValidationErrors,
  withdrawHEWE
);
router.get(
  "/getWithdrawHeweHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getWithdrawHeweHistory
);
router.post(
  "/withdrawAMC",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("method")
    .exists()
    .notEmpty()
    .custom((value) => value === "AMC20"),
  body("address").exists().notEmpty(),
  body("amount")
    .exists()
    .notEmpty()
    .isNumeric()
    .custom((value) => value > 0)
    .toFloat(),
  handleValidationErrors,
  withdrawAMC
);
router.get(
  "/getWithdrawAmcHistory",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getWithdrawAmcHistory
);

///////////////////////
///////////////////////
router.put("/addDataToDatabase", limiter, addDataToDatabase);
router.put("/addDataToDatabaseReve", limiter, addDataToDatabaseReve);

///////////////////////
// mua HEWE bằng USDT theo gói // không mua lẻ, có bonus, có hoa hồng
///////////////////////
router.post(
  "/buyPackageHeweByUSDT",
  limiter,
  recaptcha,
  VERIFY_USER.verifyUserToken,
  body("packageName")
    .exists()
    .notEmpty()
    .custom((value) => {
      const listPackage = getListPackage();
      return listPackage.find((item) => item.name === value);
    }),
  handleValidationErrors,
  buyPackageHeweByUSDT
);
router.get(
  "/getHistoryBuyPackageHeweByUSDT",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getHistoryBuyPackageHeweByUSDT
);

///////////////////////
// cho user update địa chỉ ví vào trường walletAddress trong collection user
///////////////////////
router.post(
  "/updateWalletAddressUser",
  VERIFY_USER.verifyUserToken,
  body("address").exists().notEmpty().isString().trim().isEthereumAddress(),
  handleValidationErrors,
  updateWalletAddressUser
);

///////////////////////
// lấy danh sách hoa hồng
///////////////////////
router.get(
  "/getCommissionHistoryUser",
  VERIFY_USER.verifyUserToken,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getCommissionHistoryUser
);
router.post(
  // api này cho bên thứ 3 gọi khi user mua gói bằng cách kết nối ví // không cần verify token
  "/buyPackageConnectWallet",
  body("address").exists().notEmpty().trim(),
  body("amount").exists().notEmpty(),
  body("transactionHash").exists().notEmpty().trim(),
  handleValidationErrors,
  buyPackageConnectWallet
);

router.post("/testTelegram", testTelegram);

router.post(
  // api public cho bên thứ 3 gọi để kiểm tra 1 user có thực hiện giao dịch hewe db hay không
  "/checkUserHeweDB",
  body("email").exists().notEmpty().isString().trim().isEmail(),
  handleValidationErrors,
  checkUserHeweDB
);

module.exports = router;
