const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");

exports.getOrders = async (req, res, next) => {
  const obj = { data: {} };
  try {
    const result = await Order.fetchAll();
    obj.data.order = Order.getOrderResponse(result[0]);
    next(obj);
  } catch (err) {
    return next(err);
  }
}
exports.getOrder = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const orderId = req.params.orderId;
  try {
    const result = await Order.findById(orderId);
    obj.data.order = Order.getOrderResponse(result[0]);
    next(obj);
  } catch (err) {
    return next(err);
  }
}
exports.getNewOrder = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const userId = req.userId;
  try {
    let result = await Order.findCart(userId);
    if (result[0].length == 0) {
      await addNewOrder(userId);
      result = await Order.findCart(userId);
    }
    obj.data.order = result[0];
    next(obj);
  } catch (err) {
    return next(err);
  }
}


exports.postUpdateOrderDetail = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const orderId = req.body.order_id;
  const productId = req.body.product_id;
  const shopId = req.body.shop_id;
  const quantity = req.body.quantity;
  const isActive = true;

  try {
    const orderDetail = new OrderDetail(orderId, productId, quantity, shopId, isActive);
    const result = await orderDetail.save();
    obj.insertedId = result[0].insertId;
    next(obj);
  } catch (err) {
    return next(err);
  }
}

exports.postUpdateOrder = async (req, res, next) => {
  //status order - total price
  //status ems
  //cancel order
}

exports.postConfirmOrder = async (req, res, next) => {
  //status order
}

const addNewOrder = async (userId) => {
  try {
    const statusId = Order.ORDER_CART_STATUS.id; 
    const status = Order.ORDER_CART_STATUS.text;
    const totalPrice = 0;
    const transfer = null;
    const bankId = null;
    const isActive = true;
    const ems = null;
    const emsStatus = null;
    const emsStatusId = null;
    const order = new Order(userId, statusId, status, totalPrice, transfer, bankId, isActive, ems, emsStatus, emsStatusId);
    const result = await order.save();
   
    return  result[0].insertId;
  } catch (err) {
    const error =  new Error("Cannot create cart");
    error.statusCode = 500;
    throw error;
  }
}