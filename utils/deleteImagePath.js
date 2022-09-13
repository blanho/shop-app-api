const fs = require("fs");
const path = require("path");

const deleteImagePath = (imagePath) => {
  fs.unlink(path.join(__dirname, imagePath), (err) => {
    if (err) throw err;
    console.log("Deleted file successfully");
  });
};

module.exports = deleteImagePath;
