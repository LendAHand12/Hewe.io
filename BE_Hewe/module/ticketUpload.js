const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { error_400 } = require("../utils/error");
const { handleValidationErrors } = require("../middleware/handleValidationErrors");

// Ảnh ticket lưu trong public/ticket-images, được serve ở /ticket-images
const TICKET_IMAGE_DIR = path.join(__dirname, "..", "public", "ticket-images");
const TICKET_IMAGE_URL_PREFIX = "/ticket-images/";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIMES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

// Tạo sẵn folder (cả local và production) để multer không lỗi ENOENT
fs.mkdirSync(TICKET_IMAGE_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdirSync(TICKET_IMAGE_DIR, { recursive: true });
      callback(null, TICKET_IMAGE_DIR);
    },
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ALLOWED_MIMES[file.mimetype]}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, callback) => {
    if (ALLOWED_MIMES[file.mimetype]) return callback(null, true);
    callback(new Error("Only PNG, JPEG or WEBP image files are supported"));
  },
});

// Middleware nhận tối đa maxCount ảnh ở field "images", trả lỗi 400 thay vì throw
const uploadTicketImages = (maxCount) => (req, res, next) => {
  upload.array("images", maxCount)(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") return error_400(res, `You can upload at most ${maxCount} image(s)`);
      if (err.code === "LIMIT_FILE_SIZE") return error_400(res, "Each image must be 5MB or smaller");
    }
    return error_400(res, err.message || "Upload failed");
  });
};

const getUploadedImageUrls = (req) => (req.files || []).map((file) => TICKET_IMAGE_URL_PREFIX + file.filename);

// Xóa file đã upload khi request thất bại
const removeUploadedFiles = (req) => {
  (req.files || []).forEach((file) => fs.unlink(file.path, () => {}));
};

// Giống handleValidationErrors nhưng xóa ảnh đã upload nếu validate thất bại
const handleValidationErrorsAndCleanup = (req, res, next) => {
  if (!validationResult(req).isEmpty()) removeUploadedFiles(req);
  return handleValidationErrors(req, res, next);
};

module.exports = {
  uploadTicketImages,
  getUploadedImageUrls,
  removeUploadedFiles,
  handleValidationErrorsAndCleanup,
  TICKET_IMAGE_DIR,
};
