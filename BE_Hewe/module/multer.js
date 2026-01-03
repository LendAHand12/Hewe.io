const multer = require("multer");

const uploadImageModule = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./images/blog");
    },
    filename: (req, file, callback) => {
      const ext = file.mimetype.split("/")[1];
      callback(null, `img${Date.now()}.${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const type = file.mimetype.split("/")[0];
    const ext = file.mimetype.split("/")[1];

    if (type == "image" && (ext == "png" || ext == "jpeg")) {
      callback(null, true);
    } else {
      callback(new Error("Only PNG or JPEG image files are supported"));
    }
  },
});

module.exports = { uploadImageModule };
