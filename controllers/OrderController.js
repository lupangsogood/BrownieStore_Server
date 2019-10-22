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
  let isActive = req.body.is_active;
  let ems = req.body.order_ems;
  let emsStatus = req.body.order_ems_sts;
  let emsStatusId = req.body.order_ems_sts_id;
  let statusId;
  let status;

  if (isActive == false) {
    statusId = Order.ORDER_SHOP_CANCEL_STATUS.id;
    status = Order.ORDER_SHOP_CANCEL_STATUS.text;
  } else {
    statusId = Order.ORDER_SHIPPING_STATUS.id;
    status = Order.ORDER_SHIPPING_STATUS.text;
  }

  try {
    const orderResult = await Order.findById(orderId);
    const oldOrder = orderResult[0][0];
    
    isActive = (isActive === undefined ? oldOrder.is_active : isActive);
    ems = (ems === undefined ? oldOrder.order_ems : ems);
    emsStatus = (emsStatus === undefined ? oldOrder.order_ems_sts : emsStatus);
    emsStatusId = (emsStatusId === undefined ? oldOrder.order_ems_sts_id : emsStatusId);
    
    const order = new Order({
      orderId: orderId, 
      statusId: statusId,
      status: status,
      isActive: isActive, 
      ems: ems,
      emsStatus:emsStatus,
      emsStatusId: emsStatusId
    });
 
    const result = await order.updateOrder();
    next(obj);
  } catch (err) {
    return next(err);
  }
}

exports.postUpdateConfirmOrder = async (req, res, next) => {
  //cancel order or submit cart
  const obj = { insertedId:0, data: {} };
  const orderId = req.params.order_id;
  let statusId = req.body.order_sts_id;
  let status;
  try {
    console.log(statusId , Order.ORDER_PENDING_STATUS.id);

    switch (parseInt(statusId)) {
      case Order.ORDER_PENDING_STATUS.id : 
        status = Order.ORDER_PENDING_STATUS.text; 
        break;
      default : {
        statusId = Order.ORDER_CANCEL_STATUS.id;
        status = Order.ORDER_CANCEL_STATUS.text;
      }
    }
    const order = new Order({
      orderId: orderId, 
      statusId: statusId,
      status: status
    }); 
    const result = await order.updateStatusOrder();
    next(obj);
  } catch (err) {
    return next(err);
  }
}


exports.postPayment = async (req, res, next) => {
  //update slip and status
}



const addNewOrder = async (userId) => {
  try {
    const statusId = Order.ORDER_CART_STATUS.id; 
    const status = Order.ORDER_CART_STATUS.text;
    const order = new Order({userId: userId, statusId: statusId, status: status });
    const result = await order.save();
    return result;
  } catch (err) {
    const error =  new Error("Cannot create cart");
    error.statusCode = 500;
    throw error;
  }
}