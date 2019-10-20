const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

module.exports = class Product {
  constructor(productId, name, unitName, desc, imgUrl, rating, typeId, isActive) {
    this.productId = productId;
    this.name = name;
    this.unitName = unitName;
    this.desc = desc;
    this.imgUrl = imgUrl;
    this.rating = rating;
    this.typeId = typeId;
    this.isActive = isActive;
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  async save() {
    const data =  await filter.filterData(
      [
        this.name,
        this.unitName,
        this.desc,
        this.imgUrl,
        this.rating,
        this.typeId,
        this.createdAt,
        this.updatedAt,
        this.isActive
      ]
    );
    return db.execute(
      "INSERT INTO products (product_name, product_unit, product_desc, product_img_url, product_rating, type_id, created_at, updated_at, is_active) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", data
    );
  }

  async update() {
    const data =  await filter.filterData(
      [
        this.name,
        this.unitName,
        this.desc,
        this.imgUrl,
        this.rating,
        this.typeId,
        this.updatedAt,
        this.isActive,
        this.productId
      ]
    );
    return db.execute(
      "UPDATE products SET product_name=?, product_unit=?, product_desc=?, product_img_url=?, product_rating=?, type_id=?, updated_at=?, is_active=? " +
        "WHERE product_id=?", data
    );
  }

  static async deleteById(productId) {}

  static async testCallback(cb) {
    return db.execute("SELECT * FROM products WHERE is_active = 1", cb);
  }

  static async fetchAll() {
    return db.execute(`
    SELECT 
    p.product_id, p.product_name, p.product_unit, p.product_desc, p.product_img_url, p.product_rating,
    t.type_id, t.type_name
    FROM products p
    INNER JOIN types t ON p.type_id = t.type_id
    WHERE p.is_active = 1`);
  }

  static async findById(productId) {
    const data =  await filter.filterData([productId]);
    return db.execute(
      `SELECT
      p.product_id, p.product_name, p.product_unit, p.product_desc, p.product_img_url, p.product_rating,
      t.type_id, t.type_name
      FROM products p
      INNER JOIN types t ON p.type_id = t.type_id 
      WHERE p.product_id = ? AND p.is_active = 1`,
      data
    );
  }
};
