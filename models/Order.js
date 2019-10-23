const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

const ORDER_CART_STATUS = {id: 1, text: 'ตระกร้าสินค้า'};
const ORDER_PENDING_STATUS = {id: 2, text: 'รอชำระเงิน'};
const ORDER_WAITING_STATUS = {id: 3, text: 'รอตรวจสอบ'};
const ORDER_SHIPPING_STATUS = {id: 4, text: 'รอขนส่ง'};
const ORDER_COMPLETE_STATUS = {id: 5, text: 'สำเร็จ'};
const ORDER_CANCEL_STATUS = {id: 6, text: 'ยกเลิก'};
const ORDER_SHOP_CANCEL_STATUS = {id: 7, text: 'ยกเลิก (เจ้าของร้าน)'};



module.exports = class Order {
  constructor({
    orderId = null, userId = null, statusId = null, status = null, 
    totalPrice = null, transfer = null, imgUrl = null, bankId = null, 
    isActive = true,
    emsBarcode = null, emsStatus = null, emsDesc = null, emsDate = null,
    emsLocation = null, emsPostCode = null, emsDeliveryStatus = null, 
    emsDeliveryDesc = null, emsDeliveryDate = null, emsReceiver = null, emsSignature = null,
    transferedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),
    createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),
    updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
    }) {
    this.orderId = orderId;
    this.userId = userId;
    this.statusId = statusId;
    this.status = status;
    this.totalPrice = totalPrice;
    this.transfer = transfer;
    this.imgUrl = imgUrl;
    this.bankId = bankId;
    this.isActive = isActive;
    this.emsBarcode = emsBarcode;
    this.emsStatus = emsStatus;
    this.emsDesc = emsDesc;
    this.emsDate = emsDate;
    this.emsLocation = emsLocation;
    this.emsPostCode = emsPostCode;
    this.emsDeliveryStatus = emsDeliveryStatus;
    this.emsDeliveryDesc = emsDeliveryDesc;
    this.emsDeliveryDate = emsDeliveryDate;
    this.emsReceiver = emsReceiver; 
    this.emsSignature = emsSignature;
    this.transferedAt = transferedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
    const data =  await filter.filterData([Order.ORDER_CART_STATUS.id]);
    return db.execute(`
    SELECT  * FROM orders o 
    INNER JOIN order_detail od ON o.order_id = od.order_id
    INNER JOIN products p ON p.product_id = od.product_id
    INNER JOIN types t ON t.type_id = p.type_id
    INNER JOIN shops s ON s.shop_id = od.shop_id
    WHERE o.order_sts_id <> ?
    `, data);
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
      `
      SELECT o.*, p.*, od.quantity, od.price FROM orders o 
      LEFT JOIN order_detail od ON o.order_id = od.order_id
      LEFT JOIN products p ON p.product_id = od.product_id
      LEFT JOIN types t ON t.type_id = p.type_id
      LEFT JOIN shops s ON s.shop_id = od.shop_id
      WHERE o.user_id = ? AND o.order_sts_id = ? LIMIT 1
      `
      , data);
  }

  async updatePayment() {
    const data =  await filter.filterData(
      [
        this.imgUrl,
        this.statusId,
        this.status,
        this.bankId,
        this.transferedAt,
        this.updatedAt,
        this.orderId
      ]
    );
    return db.execute(
      `UPDATE orders SET order_img_url=?, order_sts_id=?, order_sts=?, bank_id=?,
      transfered_at=? ,updated_at=? WHERE order_id = ?`
      , data);
  }

  async updateOrder() {
    const data =  await filter.filterData(
      [
        this.emsBarcode,
        this.statusId,
        this.status,
        this.transfer,
        this.updatedAt,
        this.isActive,
        this.orderId
      ]
    );
    return db.execute(
      `UPDATE orders SET 
      ems_barcode=?,
      order_sts_id=?, order_sts=?, order_transfer=?, updated_at=?, 
      is_active=? WHERE order_id =?`
      , data);
  }

  static async findCronJobOrder() {
    return db.execute(`SELECT * FROM orders WHERE (ems_barcode IS NOT NULL AND ems_barcode <> '') AND order_sts_id = ?`, 
    [ORDER_SHIPPING_STATUS.id]);
  }

  async updateCronJobOrder() {
    const data =  await filter.filterData(
      [
        this.emsBarcode,
        this.emsStatus,
        this.emsDesc,
        this.emsDate,
        this.emsLocation,
        this.emsPostCode,
        this.emsDeliveryStatus,
        this.emsDeliveryDesc,
        this.emsDeliveryDate,
        this.emsReceiver,
        this.emsSignature,
        this.statusId,
        this.status,
        this.updatedAt,
        this.orderId
      ]
    );
    return db.execute(
      `UPDATE orders SET
      ems_barcode=?, 
      ems_sts=?, 
      ems_desc=?, 
      ems_date=?, 
      ems_location=?, 
      ems_postcode=?, 
      ems_delivery_sts=?, 
      ems_delivery_desc=?, 
      ems_delivery_date=?, 
      ems_receiver=?, 
      ems_signature=?, 
      order_sts_id=?, 
      order_sts=?, 
      updated_at=? 
      WHERE order_id = ?`
      , data);
  }


  static async updateTotalPrice(orderId) {
    const updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    const data =  await filter.filterData(
      [
        updatedAt,
        orderId,
        orderId
      ]
    );
    return db.execute(
      `UPDATE orders o SET o.updated_at = ? ,o.order_total_price = COALESCE((SELECT SUM(od.quantity*od.price) AS total FROM order_detail od WHERE od.order_id = ?), 0)
       WHERE o.order_id = ?`
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
  static get ORDER_CANCEL_STATUS() {
    return ORDER_CANCEL_STATUS;
  }
  static get ORDER_SHOP_CANCEL_STATUS() {
    return ORDER_SHOP_CANCEL_STATUS;
  }


  
  static getOrderResponse(data) {
    let ids = [];
    let result = [];
    let mapId = {};
    let index = 0;
    data.forEach((data) => {

      if (!data.order_id) {
        return;
      }

      if (!ids.includes(data.order_id)) {
        let order = {};
        order.order_id = data.order_id;
        order.order_sts_id = data.order_sts_id;
        order.order_sts =  data.order_sts;
        order.ems_barcode = data.ems_barcode;
        order.ems_sts = data.ems_sts;
        order.ems_desc = data.ems_desc;
        order.ems_date = data.ems_date;
        order.ems_location = data.ems_location;
        order.ems_postcode = data.ems_postcode;
        order.ems_delivery_sts	 = data.ems_delivery_sts	;
        order.ems_delivery_desc = data.ems_delivery_desc;
        order.ems_receiver = data.ems_receiver;
        order.ems_signature	 = data.ems_signature	;
        order.order_total_price = data.order_total_price;
        order.order_transfer = data.order_transfer
        order.transfer = data.transfer;
        order.bank_id = data.bank_id;
        order.transfered_at = data.transfered_at;
        order.is_active = data.is_active;
        order.product = [];
        if (data.product_id != null) {
          const orderDetail = Order.getOrderDetail(data);
          order.product.push(orderDetail);
        }
        ids.push(data.order_id);
        result.push(order);
        mapId[data.order_id] = index;
        index++;
      } else {
        if (data.product_id != null) {
          const orderDetail = Order.getOrderDetail(data);
          result[mapId[data.order_id]].product.push(orderDetail);
        }
      }

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
