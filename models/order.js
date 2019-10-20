const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

const SHOW_ALL_ORDER = 0;
const ORDER_CART_STATUS = {id: 1, text: 'CART'};
const ORDER_PENDING_STATUS = {id: 2, text: 'PENDING'};
const ORDER_WAITING_STATUS = {id: 3, text: 'WAITING'};
const ORDER_SHIPPING_STATUS = {id: 4, text: 'SHIPPING'};
const ORDER_COMPLETE_STATUS = {id: 5, text: 'COMPLETE'};

module.exports = class DetailOrder {
  constructor(userId, orderStsId, orderSts, totalPrice, tranferPrice, bank_id, tranferedAt, isActive) {
    this.userId = userId;
    this.orderStsId = orderStsId;
    this.orderSts = orderSts;
    this.totalPrice = totalPrice;
    this.tranferPrice = tranferPrice;
    this.bank_id = bank_id;
    this.tranferedAt = tranferedAt;
    this.isActive = isActive;
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  async save() {
    const data =  await filter.filterData(
      [
        this.userId,
        this.orderStsId,
        this.orderSts,
        this.totalPrice,
        this.tranferPrice,
        this.bank_id,
        this.tranferedAt,
        this.createdAt,
        this.updatedAt
      ]
    );
    return db.execute(
      `INSERT INTO orders (user_id, order_sts_id, order_sts, order_total_price, order_transfer, bank_id, tranfered_at, created_at, updated_at, is_active
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data
    );
  }

  
  static async findOrder(userId, orderStatusId) {
    const data =  await filter.filterData([userId, orderStatusId]);
    const result = await db.execute(
    `
    SELECT
    o.order_id,
    dto.detail_order_id,
    dp.detail_product_id, dp.detail_product_quantity, dp.detail_product_price, dp.topping_detail_product_id,
    p.product_id, p.product_name, p.product_unit, p.product_desc, p.product_img_url, p.product_rating,
    t.type_id, t.type_name,
    tp.topping_product_id, ds.detail_shop_id, ds.quantity, ds.price, ds.shop_id
  
    FROM orders o 
    INNER JOIN detail_order dto ON dto.order_id = o.order_id
    INNER JOIN detail_shop ds ON ds.shop_id = dto.shop_id
    INNER JOIN shops s ON s.shop_id = ds.shop_id
    INNER JOIN detail_product dp ON dp.product_id = ds.product_id AND dto.detail_order_id = dp.detail_order_id
    LEFT JOIN topping tp ON tp.product_id = dp.product_id
    INNER JOIN products p ON p.product_id = dp.product_id
    INNER JOIN types t ON p.type_id = t.type_id
      
    UNION

    SELECT
    o.order_id,
    dto.detail_order_id,
    dp.detail_product_id, dp.detail_product_quantity, dp.detail_product_price, dp.topping_detail_product_id,
    p.product_id, p.product_name, p.product_unit, p.product_desc, p.product_img_url, p.product_rating,
    t.type_id, t.type_name,
    NULL as topping_product_id, ds.detail_shop_id, ds.quantity, ds.price,ds.shop_id
    FROM products p 
    INNER JOIN detail_shop ds ON p.product_id = ds.product_id    
    INNER JOIN types t ON p.type_id = t.type_id
    INNER JOIN topping tp ON tp.topping_product_id = p.product_id
    LEFT JOIN detail_order dto ON  dto.shop_id = ds.shop_id
    LEFT JOIN detail_product dp ON dp.product_id = ds.product_id AND dp.detail_order_id = dto.detail_order_id AND dp.topping_detail_product_id = tp.product_id
    LEFT JOIN orders o ON o.order_id = dto.order_id
    GROUP BY dp.detail_product_id, p.product_id, ds.shop_id
    `
    , data);

    return findTopping(result[0]);
  }

  
  static get ORDER_CART_STATUS() {
    return ORDER_CART_STATUS;
  }
  static get ORDER_PENDING_STATUS() {
    return ORDER_PENDING_STATUS;
  }
  static get ORDER_WAITING_STATUS() {
    return ORDER_WAITING_STATUS;
  }
  static get ORDER_SHIPPING_STATUS() {
    return ORDER_SHIPPING_STATUS;
  }
  static get ORDER_COMPLETE_STATUS() {
    return ORDER_COMPLETE_STATUS;
  }
  static get SHOW_ALL_ORDER() {
    return SHOW_ALL_ORDER;
  }
}

const findTopping = (rows) => {
  let mapToppingId = {};
  let ids = [];
  let toppings = rows.filter(topping => topping.topping_product_id == null);
  let products = rows.filter(product => {
    const key = product.detail_product_id;
    const inserted = ids.includes(product.detail_product_id);
    //check product if it has topping then collected
    if (product.topping_product_id != null) {
        if (!mapToppingId[key]) {
          mapToppingId[key] = [];
        }
        mapToppingId[key].push(product.topping_product_id);
    }

    if (!inserted && product.detail_product_id) {
      ids.push(product.detail_product_id);
    } 
    return (product.detail_product_id && product.topping_product_id) && !inserted;
  });


  products.forEach(product => {
    const key = product.detail_product_id;
    let toppingIds = [];
    // delete product.order_id;
    delete product.topping_product_id;

    product.topping = toppings.filter(topping => {
      // delete topping.order_id;
      delete topping.topping_product_id;

      if (!mapToppingId[key]) {
        return false;
      }
      topping.topping = [];
      const canAdd = mapToppingId[key].includes(topping.product_id) 
        && product.shop_id == topping.shop_id 
        && (product.detail_product_id == topping.topping_detail_product_id || !topping.topping_detail_product_id);

      if (canAdd && !toppingIds.includes(topping.product_id)) {
        toppingIds.push(topping.product_id);
        return true;
      }
      return false;
    });
  });
  return products;
}