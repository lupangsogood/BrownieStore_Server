const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Role = require("../models/Role");
const Resize = require('../util/resize');
const uuidv1 = require('uuid/v1');
const s3 = require("../util/s3");

exports.getOrders = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const userId = req.user_id;
  const roleId = req.role_id;
  try {
    let result;
    if (roleId == Role.ROLE_ADMIN) {
      result = await Order.fetchAll();
    } else if (roleId == Role.ROLE_USER) {
      result = await Order.fetchAllByUser(userId);
    }
    obj.data.order = Order.getOrderResponse(result[0]);
    next(obj);
  } catch (err) {
    return next(err);
  }
}
exports.getOrder = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const userId = req.user_id;
  const roleId = req.role_id;
  const orderId = req.params.order_id;
  try {
    let result;
    if (roleId == Role.ROLE_ADMIN) {
      result = await Order.findById(orderId);
    } else if (roleId == Role.ROLE_USER) {
      result = await Order.findByIdByUser(orderId, userId);
    }
    obj.data.order = Order.getOrderResponse(result[0]);
    next(obj);
  } catch (err) {
    return next(err);
  }
}
exports.getNewOrder = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const userId = req.user_id;
  const roleId = req.role_id;
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
  const orderId = req.params.order_id;
  const userId = req.user_id;
  const roleId = req.role_id;
  const statusId = req.body.order_sts_id;
  let status;
  let transfer = req.body.order_transfer;
  let emsBarcode = req.body.ems_barcode;
  let isActive = true;

  if (statusId == Order.ORDER_CART_STATUS.id) {
    status = Order.ORDER_CART_STATUS.text; 
  } else if (statusId == Order.ORDER_PENDING_STATUS.id) {
    status = Order.ORDER_PENDING_STATUS.text; 
  } else if (statusId == Order.ORDER_WAITING_STATUS.id) {
    status = Order.ORDER_WAITING_STATUS.text; 
  } else if (statusId == Order.ORDER_SHIPPING_STATUS.id) {
    status = Order.ORDER_SHIPPING_STATUS.text; 
    Order.updateStock(orderId);
  } else if (statusId == Order.ORDER_COMPLETE_STATUS.id) {
    status = Order.ORDER_COMPLETE_STATUS.text; 
  } else if (statusId == Order.ORDER_CANCEL_STATUS.id) {
    status = Order.ORDER_CANCEL_STATUS.text; 
    Order.updateStock(orderId, isCancel = true);
  } else if (statusId == Order.ORDER_SHOP_CANCEL_STATUS.id) {
    isActive = false;
    status = Order.ORDER_SHOP_CANCEL_STATUS.text;     
    Order.updateStock(orderId, isCancel = true);
  }

  try {
    const orderResult = await Order.findById(orderId);
    const oldOrder = orderResult[0][0];
    if (oldOrder != undefined) {
      isActive = (isActive === undefined ? oldOrder.is_active : isActive);
      emsBarcode = (emsBarcode === undefined ? oldOrder.ems_barcode : emsBarcode);
      transfer = (transfer === undefined ? oldOrder.order_transfer : parseFloat(transfer).toFixed(2));
    } else {
      isActive = true;
      emsBarcode = null;
      transfer = 0;
    }

    const orderAt = (oldOrder === undefined ? null : oldOrder.order_at);
    const order = new Order({
      orderId: orderId, 
      statusId: statusId,
      status: status,
      emsBarcode: emsBarcode,
      isActive: isActive, 
      transfer: transfer,
      orderAt: orderAt
    }); 
    const result = await order.updateOrder();
    next(obj);
  } catch (err) {
    return next(err);
  }
}


// exports.postPayment = async (req, res, next) => {
//   //update slip and status
//   const obj = { insertedId:0, data: {} };
//   const userId = req.user_id;
//   const orderId = req.params.order_id;
//   const bankId = req.body.bank_id;
//   const statusId = Order.ORDER_WAITING_STATUS.id;
//   const status = Order.ORDER_WAITING_STATUS.text;
//   let imgUrl = '';

//   if (req.file != undefined) {
//     if (process.env.S3_USING) {
//       const filePath =  req.file.path;
//       const fileName =   req.file.destination + '/' + orderId + '_' + userId + '_' + uuidv1() + '.' + req.file.filename.split(".")[1];
//       const result = await s3.upload(filePath, fileName);
//       imgUrl = result.Location;
//     } else {
//       const file = new Resize(req.file); //need to naming in html as "image" from setting multer in app.js 
//       imgUrl =  req.file.destination + '/' + orderId + '_' + userId + '_' + uuidv1() + '.' + req.file.filename.split(".")[1];
//       file.save(imgUrl);
//     }
//   }
  
//   try {
//     const order = new Order({
//       orderId: orderId, 
//       statusId: statusId,
//       status: status,
//       imgUrl: imgUrl,
//       bankId: bankId
//     }); 
//     const result = await order.updatePayment();
//     next(obj);
//   } catch (err) {
//     return next(err);
//   }
// }



const formidable = require('formidable');
const http = require('http');
const util = require('util');

exports.postPayment = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    //update slip and status
    const obj = { insertedId:0, data: {} };
    const userId = req.user_id;
    const orderId =  req.params.order_id;
    const bankId = fields.bank_id;
    const statusId = Order.ORDER_WAITING_STATUS.id;
    const status = Order.ORDER_WAITING_STATUS.text;
    let imgUrl = '';

    try {
      if (files.image != undefined) {
        if (process.env.S3_USING) {
          const filePath =  files.image.path;
          const fileName =   'images/slip/' + userId + '/' + orderId + '_' + userId + '_' + uuidv1() + '_' + files.image.name;
          const result = await s3.upload(filePath, fileName);
          imgUrl = result.Location;
        }
      }
    
      const order = new Order({
        orderId: orderId, 
        statusId: statusId,
        status: status,
        imgUrl: imgUrl,
        bankId: bankId
      }); 
      const result = await order.updatePayment();
      next(obj);
    } catch (err) {
      return next(err);
    }

  });
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