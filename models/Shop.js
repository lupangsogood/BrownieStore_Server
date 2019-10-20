const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

module.exports = class Shop {
  constructor(shopId, shopName, shopTel, isActive) {
    this.shopId = shopId;
    this.shopName = shopName;
    this.shopTel = shopTel;
    this.isActive = isActive;
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }


  async save() {
    const data =  await filter.filterData(
      [
        this.shopName,
        this.shopTel,
        this.createdAt,
        this.updatedAt,
        this.isActive
      ]
    );
    return db.execute(
      `INSERT INTO shops (shop_name, shop_tel, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?)`
      , data);
  }

  static async fetchAll() {
    return db.execute(`SELECT shop_id, shop_name, shop_tel FROM shops WHERE is_active = 1`);
  }
  
  static async findById(shopId) {
    const data =  await filter.filterData([shopId]);
    return db.execute(
      `SELECT s.shop_id, s.shop_name, s.shop_tel FROM shops s WHERE s.shop_id = ? `
      , data);
  }

  async update() {
    const data =  await filter.filterData(
      [
        this.shopName,
        this.shopTel,
        this.updatedAt,
        this.isActive,
        this.shopId
      ]
    );
    return db.execute(
      `UPDATE shops SET shop_name=?, shop_tel=?, updated_at=?, is_active=? WHERE shop_id=? `
      , data);
  }
  
}



