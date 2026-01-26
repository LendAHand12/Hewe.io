const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/auth&UserController");
const adminRoleController = require("../controller/admin/roleController");
const adminBlogController = require("../controller/admin/blogController");
const twoFactorController = require("../controller/admin/twoFactorController");
const message = require("../middleware/validationError");
const validation = require("../validation/adminValidation");
const VERIFY_ADMIN = require("../middleware/authMiddleware");
const {
  getAllTransactionsBuyBCFVND,
  confirmTransactionsBuyBCFVND,
  rejectTransactionsBuyBCFVND,
  getAllTransactionsWithdrawHewe,
  approveWithdrawHewe,
  rejectWithdrawHewe,
  getSwapHistoryAdmin,
  getDepositUSDTHistoryAdmin,
  setUSDTBalance,
  getAllTransactionsWithdrawUSDT,
  approveWithdrawUSDT,
  rejectWithdrawUSDT,
  getHistoryBuyPackageHeweByUSDTAdmin,
  getCommissionHistory,
  approveCommission,
  rejectCommission,
  adminGetPricing,
  adminUpdatePricing,
  getHeweDBData,
  getAllTransactionsWithdrawAmc,
  approveWithdrawAmc,
  rejectWithdrawAmc,
  setHEWEBalance,
  setAMCBalance,
  adminGetCommissionPercentage,
  adminUpdateCommissionPercentage,
  getHeweDBData_F1User,
  getProfileUserId,
  getDetailUserList,
  getHeweDBData_User,
  getConfigValue,
  updateConfigValue,
  setUserBalance,
  getHistorySetUserBalance,
  adminSellToken,
  searchUserByKeyword,
  getHistoryRevenue,
  adminUpdatePool,
  getDepositAMCHistoryAdmin,
  adminGetPool,
  extractKey,
  searchWalletUser,
  getHistoryUpdateAddress,
  getDepositHEWEHistoryAdmin,
  approveWithdrawAmcAutoTransfer,
  approveWithdrawHeweAutoTransfer,
  changeBranch,
  addDataConfigValue,
  getDataConfigValue,
  verifyEmailUser,
  getSwap2025List,
  markSwap2025Transaction,
  crawOneBlock,
  editHeweDBDataToId,
  getListUpdateHeweDB
} = require("../controller/admin/newAdminController");
const { body, query } = require("express-validator");
const { handleValidationErrors } = require("../middleware/handleValidationErrors");
const { isValidObjectId } = require("mongoose");
const { uploadImageModule } = require("../module/multer");

//auth management
// router.post('/adminSignUp',adminController.adminSignUp);
router.post("/adminLogin", validation.AdminLoginValidate, message.errorResponse, adminController.adminLogin);
router.post("/adminLogout", VERIFY_ADMIN.verifyAdmin, adminController.adminLogout);
router.put(
  "/changePassword",
  VERIFY_ADMIN.verifyAdmin,
  validation.AdminChangePasswordValidate,
  message.errorResponse,
  adminController.changePassword
);

// 2FA Management
router.post("/setup2FA", VERIFY_ADMIN.verifyAdmin, twoFactorController.setup2FA);
router.post("/verify2FA", VERIFY_ADMIN.verifyAdmin, twoFactorController.verify2FA);
router.post("/disable2FA", VERIFY_ADMIN.verifyAdmin, twoFactorController.disable2FA);
router.get("/get2FAStatus", VERIFY_ADMIN.verifyAdmin, twoFactorController.get2FAStatus);

//user management
router.get("/getAllUsers", VERIFY_ADMIN.verifyAdmin, adminController.getAllUsers);
router.get("/getUserTransaction", VERIFY_ADMIN.verifyAdmin, adminController.getUserTransaction);
router.get("/getUserReferrels", VERIFY_ADMIN.verifyAdmin, adminController.getUserReferrels);
router.get("/getAllContacts", VERIFY_ADMIN.verifyAdmin, adminController.getAllContacts);
router.get("/getAllTransaction", VERIFY_ADMIN.verifyAdmin, adminController.getAllTransaction);
router.put("/verifyLAH", VERIFY_ADMIN.verifyAdmin, adminController.verifyLAH);
router.put(
  "/addLAHMember",
  VERIFY_ADMIN.verifyAdmin,
  validation.addLAHValidate,
  message.errorResponse,
  adminController.addLAHMember
);
router.get("/searchUser", VERIFY_ADMIN.verifyAdmin, adminController.searchUser);
router.get("/searchContact", VERIFY_ADMIN.verifyAdmin, adminController.searchContact);
router.get("/getReferralZeroTransaction", VERIFY_ADMIN.verifyAdmin, adminController.getReferralZeroTransaction);
router.get("/getReferralNoZeroTransaction", VERIFY_ADMIN.verifyAdmin, adminController.getReferralNoZeroTransaction);

// update all user ==>>>
router.put("/updateUserStatus", adminController.updateUserStatus);
router.put("/updateUserReferralRewards", adminController.updateUserReferralRewards);
router.put("/resetReferralRewards", adminController.resetReferralRewards);
router.put("/updateUserReferralRewardsReferral", adminController.updateUserReferralRewardsReferral);

// update one user ==>>

router.put("/updateOneUserStatus", adminController.updateOneUserStatus);
router.put("/updateOneUserReferralRewards", adminController.updateOneUserReferralRewards);
router.put("/updateOneUserReferralRewardsReferral", adminController.updateOneUserReferralRewardsReferral);

// update all collection of a single user

router.put("/userDbUpdate", adminController.userDbUpdate);
router.get("/findUserWithInDate", adminController.findUserWithInDate);

//paid Management
router.post("/paidUser", VERIFY_ADMIN.verifyAdmin, adminController.paidUser);

// transaction management
router.post("/addTransactionUser", VERIFY_ADMIN.verifyAdmin, adminController.addTransactionUser);

// SubAdmin Role Management
router.post(
  "/createSubAdmin",
  VERIFY_ADMIN.verifyAdmin,
  validation.createSubAdminValidate,
  adminRoleController.createSubAdmin
);
router.delete("/deleteSubAdmin/:id", VERIFY_ADMIN.verifyAdmin, adminRoleController.deleteSubAdmin);
router.put("/editSubAdmin/:id", VERIFY_ADMIN.verifyAdmin, adminRoleController.editSubAdmin);
router.get("/getALLSubAdmin", VERIFY_ADMIN.verifyAdmin, adminRoleController.getALLSubAdmin);
router.post("/createAccessModule", VERIFY_ADMIN.verifyAdmin, adminRoleController.createAccessModule);
router.get("/getAllModule", VERIFY_ADMIN.verifyAdmin, adminRoleController.getAllModule);
router.get("/getModulesOfAdmin", VERIFY_ADMIN.verifyAdmin, adminRoleController.getModulesOfAdmin);
router.delete("/deleteModule/:id", VERIFY_ADMIN.verifyAdmin, adminRoleController.deleteModule);
router.post("/createPermissions", VERIFY_ADMIN.verifyAdmin, adminRoleController.createPermissions);
router.get("/getAllPermissions", VERIFY_ADMIN.verifyAdmin, adminRoleController.getAllPermissions);

// Blog Management

router.post("/uploadImg", VERIFY_ADMIN.verifyAdmin, uploadImageModule.single("img"), adminBlogController.uploadImg);
router.post("/createBlog", VERIFY_ADMIN.verifyAdmin, adminBlogController.createBlog);
router.delete("/deleteBlog/:id", VERIFY_ADMIN.verifyAdmin, adminBlogController.deleteBlog);
router.get("/getAllBlogs", VERIFY_ADMIN.verifyAdmin, adminBlogController.getAllBlogs);
router.put("/editBlog/:id", VERIFY_ADMIN.verifyAdmin, adminBlogController.editBlog);
router.get("/getBlog/:id", VERIFY_ADMIN.verifyAdmin, adminBlogController.getBlog);

///////////////////////
///////////////////////
router.get(
  "/getAllTransactionsBuyBCFVND",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getAllTransactionsBuyBCFVND
);
router.post(
  "/confirmTransactionsBuyBCFVND",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  handleValidationErrors,
  confirmTransactionsBuyBCFVND
);
router.post(
  "/rejectTransactionsBuyBCFVND",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  handleValidationErrors,
  rejectTransactionsBuyBCFVND
);

///////////////////////
// rút HEWE
///////////////////////
router.get(
  "/getAllTransactionsWithdrawHewe",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getAllTransactionsWithdrawHewe
);
router.post(
  "/approveWithdrawHewe",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("transactionHash") // mã hash admin chuyển hewe cho user
    .exists()
    .notEmpty(),
  handleValidationErrors,
  approveWithdrawHewe
);
router.post(
  "/approveWithdrawHeweAutoTransfer",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  handleValidationErrors,
  approveWithdrawHeweAutoTransfer
);
router.post(
  "/rejectWithdrawHewe",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("reason") // lý do từ chối
    .exists()
    .notEmpty(),
  handleValidationErrors,
  rejectWithdrawHewe
);

///////////////////////
// rút AMC
///////////////////////
router.get(
  "/getAllTransactionsWithdrawAmc",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getAllTransactionsWithdrawAmc
);
router.post(
  "/approveWithdrawAmc",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("transactionHash") // mã hash admin chuyển amc cho user
    .exists()
    .notEmpty(),
  handleValidationErrors,
  approveWithdrawAmc
);
router.post(
  "/approveWithdrawAmcAutoTransfer",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  handleValidationErrors,
  approveWithdrawAmcAutoTransfer
);
router.post(
  "/rejectWithdrawAmc",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("reason") // lý do từ chối
    .exists()
    .notEmpty(),
  handleValidationErrors,
  rejectWithdrawAmc
);

///////////////////////
// swap // đổi thành buy token v2
///////////////////////
router.get(
  "/getSwapHistory",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("type")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .custom((value) => ["api", "connectWallet"].includes(value)),
  query("token")
    .exists()
    .notEmpty()
    .custom((value) => ["hewe", "amc"].includes(value)),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getSwapHistoryAdmin
);

///////////////////////
// deposit USDT
///////////////////////
router.get(
  "/getDepositUSDTHistory",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  query("network").optional().isString(),
  handleValidationErrors,
  getDepositUSDTHistoryAdmin
);
router.post(
  "/setUSDTBalance",
  VERIFY_ADMIN.verifyAdmin,
  body("userId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("amount").exists().notEmpty().isNumeric().toFloat(),
  handleValidationErrors,
  setUSDTBalance
);
router.post(
  "/setHEWEBalance",
  VERIFY_ADMIN.verifyAdmin,
  body("userId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("amount").exists().notEmpty().isNumeric().toFloat(),
  handleValidationErrors,
  setHEWEBalance
);
router.post(
  "/setAMCBalance",
  VERIFY_ADMIN.verifyAdmin,
  body("userId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("amount").exists().notEmpty().isNumeric().toFloat(),
  handleValidationErrors,
  setAMCBalance
);

///////////////////////
// phần mới: rút USDT
///////////////////////
router.get(
  "/getAllTransactionsWithdrawUSDT",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getAllTransactionsWithdrawUSDT
);
router.post(
  "/approveWithdrawUSDT",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("transactionHash") // mã hash admin chuyển USDT cho user
    .exists()
    .notEmpty(),
  handleValidationErrors,
  approveWithdrawUSDT
);
router.post(
  "/rejectWithdrawUSDT",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("reason") // lý do từ chối
    .exists()
    .notEmpty(),
  handleValidationErrors,
  rejectWithdrawUSDT
);

///////////////////////
// mua package HEWE bằng USDT
///////////////////////
router.get(
  "/getHistoryBuyPackageHeweByUSDT",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  handleValidationErrors,
  getHistoryBuyPackageHeweByUSDTAdmin
);

///////////////////////
// hoa hồng
///////////////////////
router.get(
  "/getCommissionHistory",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getCommissionHistory
);
router.post(
  "/approveCommission",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("transactionHash") // mã hash admin chuyển cho user
    .exists()
    .notEmpty(),
  handleValidationErrors,
  approveCommission
);
router.post(
  "/rejectCommission",
  VERIFY_ADMIN.verifyAdmin,
  body("transactionId")
    .exists()
    .notEmpty()
    .custom((value) => isValidObjectId(value)),
  body("reason") // lý do từ chối
    .exists()
    .notEmpty(),
  handleValidationErrors,
  rejectCommission
);

///////////////////////
// update pricing
///////////////////////
router.get(
  "/adminGetPricing",
  VERIFY_ADMIN.verifyAdmin,
  query("token")
    .exists()
    .notEmpty()
    .custom((value) => ["hewe", "amc"].includes(value)),
  handleValidationErrors,
  adminGetPricing
);

router.post(
  "/adminUpdatePricing",
  VERIFY_ADMIN.verifyAdmin,
  body("token")
    .exists()
    .notEmpty()
    .custom((value) => ["hewe", "amc"].includes(value)),
  body("newPrice").exists().notEmpty().isNumeric().toFloat(),
  handleValidationErrors,
  adminUpdatePricing
);

///////////////////////
// hewe db
///////////////////////
router.get(
  "/getHeweDBData",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isInt().toInt(),
  query("page").exists().notEmpty().isInt().toInt(),
  query("keyword").optional().isString(),
  query("sortBy")
    .optional()
    .isString()
    .custom((value) => ["newest", "oldest"].includes(value)),
  handleValidationErrors,
  getHeweDBData
);
router.post(
  "/editHeweDBDataToId",
  VERIFY_ADMIN.verifyAdmin,
  editHeweDBDataToId
);

router.get(
  "/getListUpdateHeweDB",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isInt().toInt(),
  query("page").exists().notEmpty().isInt().toInt(),
  query("keyword").optional().isString(),
  query("sortBy")
    .optional()
    .isString()
    .custom((value) => ["newest", "oldest"].includes(value)),
  handleValidationErrors,
  getListUpdateHeweDB
);
router.get(
  "/getHeweDBData_F1User", // lịch sử hewe db của F1 của user
  VERIFY_ADMIN.verifyAdmin,
  query("userId").exists().notEmpty().isString(),
  handleValidationErrors,
  getHeweDBData_F1User
);

router.get(
  "/getHeweDBData_User", // lịch sử hewe db của bản thân user
  VERIFY_ADMIN.verifyAdmin,
  query("userId").exists().notEmpty().isString(),
  handleValidationErrors,
  getHeweDBData_User
);

///////////////////////
// phần trăm hoa hồng
///////////////////////
router.get("/adminGetCommissionPercentage", VERIFY_ADMIN.verifyAdmin, adminGetCommissionPercentage);

router.post(
  "/adminUpdateCommissionPercentage",
  VERIFY_ADMIN.verifyAdmin,
  body("newValue").exists().notEmpty().isNumeric().toFloat(),
  handleValidationErrors,
  adminUpdateCommissionPercentage
);

///////////////////////
// chi tiết user
///////////////////////
router.get(
  "/getProfileUserId",
  VERIFY_ADMIN.verifyAdmin,
  query("userId").exists().notEmpty().isString(),
  handleValidationErrors,
  getProfileUserId
);

router.get(
  "/getDetailUserList",
  VERIFY_ADMIN.verifyAdmin,
  query("userId").exists().notEmpty().isString(),
  query("list")
    .exists()
    .notEmpty()
    .isString()
    .custom((value) =>
      [
        "deposit",
        "withdrawUSDT",
        "withdrawHEWE",
        "withdrawAMC",
        "buyTokenAPI",
        "buyTokenConnectWallet",
        "depositHEWE",
        "depositAMC",
      ].includes(value)
    ),
  query("limit").exists().notEmpty().isInt().toInt(),
  query("page").exists().notEmpty().isInt().toInt(),
  handleValidationErrors,
  getDetailUserList
);

///////////////////////
// update config
///////////////////////
router.get(
  "/getConfigValue",
  VERIFY_ADMIN.verifyAdmin,
  query("configKey").exists().notEmpty(),
  handleValidationErrors,
  getConfigValue
);

router.post(
  "/updateConfigValue",
  VERIFY_ADMIN.verifyAdmin,
  body("configKey").exists().notEmpty(),
  body("configValue").exists().notEmpty().isString(),
  handleValidationErrors,
  updateConfigValue
);

///////////////////////
// cap nhat so du cho user
///////////////////////
router.post(
  "/setUserBalance",
  VERIFY_ADMIN.verifyAdmin,
  body("userId").exists().notEmpty().isString(),
  body("token")
    .exists()
    .notEmpty()
    .isString()
    .custom((value) => ["hewe", "usdt", "amc", "hewedeposit"].includes(value)),
  body("amount").exists().notEmpty().isNumeric().toFloat(), // số dương là cộng, số âm là trừ
  handleValidationErrors,
  setUserBalance
);

router.get(
  "/historySetUserBalance",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  query("token")
    .exists()
    .notEmpty()
    .custom((value) => ["hewe", "usdt", "amc", "hewedeposit"].includes(value)),
  handleValidationErrors,
  getHistorySetUserBalance
);

///////////////////////
// admin bán token cho user, tương tự user tự mua token
///////////////////////
router.post(
  "/sellToken",
  VERIFY_ADMIN.verifyAdmin,
  body("userId").exists().notEmpty().isString().isMongoId(),
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
  adminSellToken
);

router.post(
  "/searchUserByKeyword",
  VERIFY_ADMIN.verifyAdmin,
  body("keyword").exists().notEmpty().isString(),
  handleValidationErrors,
  searchUserByKeyword
);

///////////////////////
// lịch sử doanh số + thống kê doanh số
///////////////////////
router.get(
  "/getHistoryRevenue",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  query("timeStart").exists().notEmpty().isInt().toInt(),
  query("timeEnd").exists().notEmpty().isInt().toInt(),
  handleValidationErrors,
  getHistoryRevenue
);

///////////////////////
// chart
///////////////////////
router.get(
  "/getPool",
  VERIFY_ADMIN.verifyAdmin,
  query("pool")
    .exists()
    .notEmpty()
    .isString()
    .custom((value) => ["hewe", "usdt"].includes(value)),
  handleValidationErrors,
  adminGetPool
);

router.post(
  "/updatePool",
  VERIFY_ADMIN.verifyAdmin,
  body("pool")
    .exists()
    .notEmpty()
    .isString()
    .custom((value) => ["hewe", "usdt"].includes(value)),
  body("amount").exists().notEmpty().isNumeric().toFloat(),
  handleValidationErrors,
  adminUpdatePool
);

///////////////////////
// deposit AMC + HEWE
///////////////////////
router.get(
  "/getDepositAMCHistory",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getDepositAMCHistoryAdmin
);

router.get(
  "/getDepositHEWEHistory",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getDepositHEWEHistoryAdmin
);

///////////////////////
// user wallet private key
///////////////////////
router.post(
  "/extractKey",
  VERIFY_ADMIN.verifyAdmin,
  body("userId").exists().notEmpty(),
  body("type").exists().notEmpty(),
  handleValidationErrors,
  extractKey
);

///////////////////////
// tìm kiếm các địa chỉ ví của user trong walletusers
///////////////////////
router.post(
  "/searchWalletUser",
  VERIFY_ADMIN.verifyAdmin,
  body("address").exists().notEmpty().isString().trim(),
  handleValidationErrors,
  searchWalletUser
);

///////////////////////
// lịch sử user cập nhật địa chỉ
///////////////////////
router.get(
  "/getHistoryUpdateAddress",
  VERIFY_ADMIN.verifyAdmin,
  query("limit").exists().notEmpty().isNumeric().toInt(),
  query("page").exists().notEmpty().isNumeric().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getHistoryUpdateAddress
);

///////////////////////
// đổi nhánh
///////////////////////
router.post(
  "/changeBranch",
  VERIFY_ADMIN.verifyAdmin,
  body("userId").exists().notEmpty().isMongoId(), // user cần đổi nhánh
  body("newParentId").exists().notEmpty().isMongoId(), // tuyến trên mới cần đổi qua
  handleValidationErrors,
  changeBranch
);

///////////////////////
// thêm dữ liệu vào config value
///////////////////////
router.post(
  "/addDataConfigValue",
  VERIFY_ADMIN.verifyAdmin,
  body("configKey").exists().notEmpty(),
  body("configValueString").exists().notEmpty(),
  handleValidationErrors,
  addDataConfigValue
);

router.get(
  "/getDataConfigValue",
  VERIFY_ADMIN.verifyAdmin,
  query("configKey").exists().notEmpty(),
  handleValidationErrors,
  getDataConfigValue
);

// kích hoạt email cho user
router.post(
  "/verifyEmailUser",
  VERIFY_ADMIN.verifyAdmin,
  body("userId").exists().notEmpty().isMongoId(),
  handleValidationErrors,
  verifyEmailUser
);

///////////////////////
// swap 2025 (homepage swap)
///////////////////////
router.get(
  "/getSwap2025List",
  VERIFY_ADMIN.verifyAdmin,
  query("type").exists().notEmpty().isIn(["USDT(BEP20)=>AMC(AMC20)", "AMC(AMC20)=>AMC(BEP20)"]),
  query("limit").exists().notEmpty().isInt().toInt(),
  query("page").exists().notEmpty().isInt().toInt(),
  query("keyword").optional().isString(),
  handleValidationErrors,
  getSwap2025List
);

router.post(
  "/markSwap2025Transaction",
  VERIFY_ADMIN.verifyAdmin,
  body("id").exists().notEmpty().isMongoId(),
  body("action").exists().notEmpty().isIn(["approve", "reject"]),
  body("transactionHash").optional().isString(),
  handleValidationErrors,
  markSwap2025Transaction
);

router.post(
  "/crawOneBlock",
  // VERIFY_ADMIN.verifyAdmin,
  body("blockNumber").exists().notEmpty().isInt().toInt(),
  handleValidationErrors,
  crawOneBlock
);

module.exports = router;