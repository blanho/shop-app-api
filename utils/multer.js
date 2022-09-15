const multer = require("multer");
const path = require("path");
const { BadRequest } = require("../errors");

const uploadImageToCloud = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new BadRequest("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

const uploadImageToLocal = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new BadRequest("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

module.exports = { uploadImageToLocal, uploadImageToCloud };
