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

  static async findById(shopId) {
    const data =  await filter.filterData([shopId]);
    return db.execute(
      `
      SELECT
      s.shop_id, s.shop_name, s.shop_tel
      FROM shops s 
      WHERE s.shop_id = ? 
      `, data
    );
  }
}