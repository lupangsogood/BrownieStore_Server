const multer = require("multer");

exports.fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/product');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[1];
    cb(null, Date.now() + '.' + ext);
  }
});