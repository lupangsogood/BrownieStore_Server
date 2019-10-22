const multer = require("multer");
const fs = require('fs-extra');

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

exports.uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `uploads`;
    fs.mkdirsSync(path);
    cb(null, path);

  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[1];
    cb(null, Date.now() + '.' + ext);
  }
});


exports.productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `images/product`;
    fs.mkdirsSync(path);
    cb(null, path);

  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[1];
    cb(null, Date.now() + '.' + ext);
  }
});

exports.slipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user_id;
    const path = `images/slip//${userId}`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[1];
    cb(null, Date.now() + '.' + ext);
  }
});