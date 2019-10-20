const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

const ORDER_CART_STATUS = {id: 1, text: 'CART'};
const ORDER_PENDING_STATUS = {id: 2, text: 'PENDING'};
const ORDER_WAITING_STATUS = {id: 3, text: 'WAITING'};
const ORDER_SHIPPING_STATUS = {id: 4, text: 'SHIPPING'};
const ORDER_COMPLETE_STATUS = {id: 5, text: 'COMPLETE'};

const EMS_PENDING_STATUS = {id: 1, text: 'PENDING'};
const EMS_WAITING_STATUS = {id: 3, text: 'WAITING'};
const EMS_SHIPPING_STATUS = {id: 4, text: 'SHIPPING'};
const EMS_COMPLETE_STATUS = {id: 5, text: 'COMPLETE'};


module.exports = class Order {
  constructor(userId, statusId, status, totalPrice, transfer, bankId, isActive, ems, emsStatus, emsStatusId) {
    this.userId = userId;
    this.statusId = statusId;
    this.status = status;
    this.totalPrice = totalPrice;
    this.transfer = transfer;
    this.bankId = bankId;
    this.isActive = isActive;
    this.ems = ems;
    this.emsStatus = emsStatus;
    this.emsStatusId = emsStatusId;
    this.transferedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  async save() {
    const data =  await filter.filterData(
      [
        this.userId,
        this.statusId,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.isActive
      ]
    );
    return db.execute(
      `INSERT INTO orders (user_id, order_sts_id, order_sts, created_at, updated_at, is_active) 
      VALUES (?, ?, ?, ?, ?, ?)`
      , data);
  }

  static async fetchAll() {
    return db.execute(`
    SELECT  * FROM orders o 
    INNER JOIN order_detail od ON o.order_id = od.order_id
    INNER JOIN products p ON p.product_id = od.product_id
    INNER JOIN types t ON t.type_id = p.type_id
    INNER JOIN shops s ON s.shop_id = od.shop_id
    `);
  }
  
  static async findById(orderId) {
    const data =  await filter.filterData([orderId]);
    return db.execute(
      `
      SELECT  * FROM orders o 
      INNER JOIN order_detail od ON o.order_id = od.order_id
      INNER JOIN products p ON p.product_id = od.product_id
      INNER JOIN types t ON t.type_id = p.type_id
      INNER JOIN shops s ON s.shop_id = od.shop_id
      WHERE o.order_id = ? `
      , data);
  }

  static async findCart(userId) {
    const data =  await filter.filterData([userId, Order.ORDER_CART_STATUS.id]);
    return db.execute(
      `SELECT *
      FROM orders o
      WHERE o.user_id = ? AND o.order_sts_id = ? LIMIT 1`
      , data);
  }

  async updateOrder() {
    const data =  await filter.filterData(
      [
        this.statusId,
        this.status,
        this.totalPrice,
        this.updatedAt,
        this.orderId
      ]
    );
    return db.execute(
      `UPDATE orders SET order_sts_id=?, order_sts=?, order_total_price=?, updated_at=? WHERE order_id =?`
      , data);
  }

  async updatePayment() {
    const data =  await filter.filterData(
      [
        this.statusId,
        this.status,
        this.totalPrice,
        this.transfer,
        this.bankId,
        this.transferedAt,
        this.updatedAt,
        this.orderId
      ]
    );
    return db.execute(
      `UPDATE orders SET order_sts_id=?, order_sts=?, order_total_price=?, order_transfer=?, bank_id=? 
      transferd_at=? ,updated_at=? WHERE order_id = ?`
      , data);
  }

  async updateEms() {
    const data =  await filter.filterData(
      [
        this.ems,
        this.emsStatus,
        this.emsStatusId,
        this.updatedAt,
        this.orderId
      ]
    );
    return db.execute(
      `UPDATE orders SET order_ems, order_ems_sts, order_ems_sts_id, updated_at=? WHERE order_id = ?`
      , data);
  }

  static async cancel(orderId) {
    const updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    const isActive = false;
    const data =  await filter.filterData(
      [
        updatedAt,
        isActive,
        orderId
      ]
    );
    return db.execute(
      `UPDATE orders SET updated_at=?, is_active=? WHERE order_id = ?`
      , data);
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


  static get EMS_PENDING_STATUS() {
    return EMS_PENDING_STATUS;
  }
  static get EMS_WAITING_STATUS() {
    return EMS_WAITING_STATUS;
  }
  static get EMS_SHIPPING_STATUS() {
    return EMS_SHIPPING_STATUS;
  }
  static get EMS_COMPLETE_STATUS() {
    return EMS_COMPLETE_STATUS;
  }

  
  static getOrderResponse(data) {
    let result = [];
    data.forEach((data) => {
      let order = {};
      order.order_id = data.order_id;
      order.order_sts_id = data.order_sts_id;
      order.order_sts =  data.order_sts;
      order.order_ems = data.order_ems;
      order.order_ems_sts = data.order_ems_sts;
      order.order_ems_sts_id = data.order_ems_sts_id;
      order.order_total_price = data.order_total_price;
      order.order_transfer = data.order_transfer
      order.transfer = data.transfer;
      order.bank_id = data.bank_id;
      order.transfered_at = data.transfered_at;
      order.is_active = data.is_active;
      order.product = Order.getOrderDetail(data);
      result.push(order);
    });
    return result;
  }
  static getOrderDetail(data) {
    let orderDetail = {};
    orderDetail.order_detail_id = data.order_detail_id;
    orderDetail.product_id = data.product_id;
    orderDetail.product_name = data.product_name;
    orderDetail.product_unit = data.product_unit;
    orderDetail.product_desc = data.product_desc;
    orderDetail.product_img_url = data.product_img_url;
    orderDetail.product_rating = data.product_rating;
    orderDetail.product_price = data.product_price;
    orderDetail.product_quantity = data.product_quantity;
    orderDetail.shop_name = data.shop_name;
    orderDetail.type_name = data.type_name;
    orderDetail.quantity = data.quantity;
    orderDetail.price = data.price;

    return orderDetail;
  }
}
