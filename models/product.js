const db = require('../util/database');
const moment = require('moment');
const momentz = require('moment-timezone')

module.exports = class Product {
  constructor(id, name, unitName, desc, imgUrl, rating, typeId) {
    this.id = id;
    this.name = name;
    this.unitName = unitName;
    this.desc = desc;
    this.imgUrl = imgUrl;
    this.rating = rating;
    this.typeId = typeId;

    this.createdAt = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    this.isActive = true;
  }

  save() {
    return db.execute(
      'INSERT INTO products (product_name, product_unit, product_desc, product_img_url, product_rating, type_id, created_at, updated_at, is_active) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [this.name, this.unitName, this.desc, this.imgUrl, this.rating, this.typeId, this.createdAt, this.updatedAt, this.isActive]
    );
  }

  static deleteById(id) {}

  static testCallback(cb) {
    return db.execute('SELECT * FROM products', cb);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return  db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

}