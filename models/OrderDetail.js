const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

module.exports = class OrderDetail {
  constructor(orderId, productId, quantity, shopId, isActive) {
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.shopId = shopId;
    this.isActive = isActive;
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  async save() {
    const data =  await filter.filterData(
      [
        this.orderId,
        this.productId,
        this.quantity,
        this.shopId,
        this.isActive,
        this.createdAt,
        this.updatedAt,
        this.productId,
      ]
    );
    return db.execute(
      `INSERT INTO order_detail (order_id, product_id, quantity, shop_id, is_active, created_at, updated_at, price) 
      SELECT ?, ?, ?, ?, ?, ?, ?, product_price FROM products WHERE product_id = ? LIMIT 1 `
      , data);
  }

}