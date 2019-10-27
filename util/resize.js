const sharp = require("sharp");
// const uuidv4 = require("uuid/v4");
const path = require("path");
const fs = require("fs");

class Resize {
  constructor(file) {
    this.file = file;
  }
  async save(filepath) {
    // const filepath = this.filepath(filename);

    await sharp(this.file.path)
      .resize(500, 500, { fit: sharp.fit.inside, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filepath);
    fs.unlink(this.file.path, err => {
      if (err) throw err;
      //console.log('file deleted');
    });
    return filepath;
  }

  // filename(name) {
  //   const ext = this.file.filename.split(".")[1];
  //   return `${name}.${ext}`;
  // }
  // filepath(filename) {
  //   return `${this.file.destination}/${filename}`;
  // }
}
module.exports = Resize;
