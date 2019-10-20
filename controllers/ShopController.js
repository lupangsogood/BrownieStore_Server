const Shop = require("../models/Shop");

exports.getShops = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  try {
    const result = await Shop.fetchAll();
    obj.data.shop = result[0];
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.getShop = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const shopId = req.params.shopId;
  try {
    const result = await Shop.findById(shopId);
    if (result[0].length == 0) {
      obj.data.shop = [];
    } else obj.data.shop = result[0];
    next(obj);
  } catch (err) {
    return next(err);
  }
};


exports.postAddShop = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const shopId = null;
  const name = req.body.shop_name;
  const tel = req.body.shop_tel;
  const isActive = true;
  try {
    const shop = new Shop(shopId, name, tel, isActive);
    const result = await shop.save();
    obj.insertedId = result[0].insertId;
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.postUpdateShop = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const shopId = req.params.shopId;
  const name = req.body.shop_name;
  const tel = req.body.shop_tel;
  const isActive = true;
  try {
    const shop = new Shop(shopId, name, tel, isActive);
    const result = await shop.update();
    next(obj);
  } catch (err) {
    return next(err);
  }
};