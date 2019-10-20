const OrderDetail = require("../models/orderDetail");
const Order = require("../models/order");

exports.getProductDetail = async (req, res, next) => {
  const detailProductId = req.params.detailProductId;
  //fetch a product detail for editting
}

exports.getOrderDetail = async (req, res, next) => {
  const orderId = req.params.orderId;
  //fetch all shop - product
}

exports.getCart = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  // const userId = req.user_id //get from JWT with auth util
  const userId = 1;  

  try {
    //check user has order for cart
    const result = await Order.findOrder(userId, Order.ORDER_CART_STATUS.id);
    obj.data.order =  {};
    obj.data.order.product = result;
    next(obj);
  } catch (err) {
    return next(err);
  }
}




