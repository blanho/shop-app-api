const multer = require("multer");
const { BadRequest } = require("../errors");
const { uploadImageToCloud } = require("../utils/multer");

function uploadFile(req, res, next) {
  const upload = uploadImageToCloud.single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      throw new BadRequest("Please provide an image");
    }
    next();
  });
}

module.exports = uploadFile;
