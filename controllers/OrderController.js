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
  const orderId = req.params.order_id;
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
  const userId = req.user_id;
  try {
    let result = await Order.findCart(userId);
    if (result[0].length == 0) {
      result = await addNewOrder(userId);
      result = await Order.findCart(userId);
    }
    obj.data.order = Order.getOrderResponse(result[0]);
    next(obj);
  } catch (err) {
    return next(err);
  }
}


exports.postUpdateOrderDetail = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const orderId = req.params.order_id;
  const productId = req.body.product_id;
  const shopId = req.body.shop_id;
  const quantity = req.body.quantity;
  const isActive = true;

  try {
    const orderDetail = new OrderDetail(null, orderId, productId, quantity, shopId, isActive);
    const result = await orderDetail.save();
    const updated = await Order.updateTotalPrice(orderId);
    obj.insertedId = result[0].insertId;
    next(obj);
  } catch (err) {
    return next(err);
  }
}

exports.postUpdateOrder = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const userId = req.user_id;
  const orderId = req.params.order_id;
  const isActive = req.body.is_active;

  let statusId = null;
  let status = null;
  let ems = req.body.order_ems;
  let emsStatusId = null;
  let emsStatus = null;

  const totalPrice = null;
  const transfer = null;
  const imgUrl = null;
  const bankId = null;

  if (!isActive) {
    statusId = Order.ORDER_SHOP_CANCEL_STATUS.id;
    status = Order.ORDER_SHOP_CANCEL_STATUS.text;
  } else {
    statusId = Order.ORDER_SHIPPING_STATUS.id;
    status = Order.ORDER_SHIPPING_STATUS.text;
  }
  if (!ems) {
    ems = '';
  }
  
  try {
    const order = new Order(orderId, userId, statusId, status, totalPrice, transfer, imgUrl, bankId, isActive, ems, emsStatus, emsStatusId);
    const result = await order.updateOrder();
    next(obj);
  } catch (err) {
    return next(err);
  }
}
exports.postUpdateAutoEmsOrder = async (req, res, next) => {
  //status ems
}


exports.postUpdateUserOrder = async (req, res, next) => {
  //cancel order or submit cart
}


exports.postPayment = async (req, res, next) => {
}



const addNewOrder = async (userId) => {
  try {
    const orderId = null;
    const statusId = Order.ORDER_CART_STATUS.id; 
    const status = Order.ORDER_CART_STATUS.text;
    const totalPrice = 0;
    const transfer = 0;
    const imgUrl = null;
    const bankId = null;
    const isActive = true;
    const ems = null;
    const emsStatus = null;
    const emsStatusId = null;
    const order = new Order(orderId, userId, statusId, status, totalPrice, transfer, imgUrl, bankId, isActive, ems, emsStatus, emsStatusId)
    const result = await order.save();
    return result;
  } catch (err) {
    const error =  new Error("Cannot create cart");
    error.statusCode = 500;
    throw error;
  }
}