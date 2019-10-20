const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

module.exports = class DetailShop {
  constructor(shopId, productId, quantity, price) {
    this.shopId = shopId;
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  async save() {
    const data =  await filter.filterData(
      [
        this.shopId,
        this.productId,
        this.quantity,
        this.price,
        this.createdAt,
        this.updatedAt
      ]
    );
    return db.execute(
      `INSERT INTO detail_shop (shop_id, product_id, quantity, price, created_at, updated_at) " +
        "VALUES (?, ?, ?, ?, ?, ?)`, data
    );
  }

  static async findDetailShop(shopId, productId) {
    const data =  await filter.filterData([shopId, productId, productId, productId]);
    const result = await db.execute(
      `
      SELECT
      0 AS detail_order_id, 0 AS detail_product_id,
      p.product_id, p.product_name, p.product_unit, p.product_desc, p.product_img_url, p.product_rating,
      t.type_id, t.type_name,
      tp.topping_product_id, ds.detail_shop_id, ds.shop_id, ds.quantity, ds.price
      FROM products p
      INNER JOIN detail_shop ds ON p.product_id = ds.product_id
      INNER JOIN types t ON p.type_id = t.type_id
      LEFT JOIN topping tp ON tp.product_id = p.product_id
      WHERE ds.shop_id = ?
      AND ((p.product_id = ? OR p.product_id IN 
         	(SELECT topping.topping_product_id FROM topping WHERE topping.product_id = ?)) OR  ? = 0)
      `, data
    );
    return findTopping(result[0]);
  }
}


const findTopping = (rows) => {
  let ids = [];
  let mapToppingId = {};
  let toppings = rows.filter(row => row.topping_product_id == null);
  let products = rows.filter(product => {
    const inserted = ids.includes(product.product_id);
    const key = product.product_id;
    if (!inserted) {
      ids.push(key);
    }
    if (product.topping_product_id != null) {
        if (!mapToppingId[key]) {
          mapToppingId[key] = [];
        }
        mapToppingId[key].push(product.topping_product_id);
    }
    return !inserted && product.topping_product_id != null;
  });


  products.forEach(product => {
    const key = product.product_id;
    delete product.topping_product_id;
    product.topping = toppings.filter(topping => {
      delete topping.topping_product_id;
      if (!mapToppingId[key]) {
        return false;
      }
      topping.topping = [];
      return mapToppingId[key].includes(topping.product_id);
    });
  });
  return products;
}
