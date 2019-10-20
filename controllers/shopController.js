const Shop = require("../models/shop");
const Type = require("../models/type");
const ShopDetail = require("../models/shopDetail");

exports.getShopDetail = async (req, res, next) => {
  const obj = { data: {} };
  const shopId = req.params.shopId;
  let productId = req.params.productId;
  if (!productId) {
    productId = 0;
  }

  try {
    const [shop, products, type] = await Promise.all([
      Shop.findById(shopId), 
      ShopDetail.findDetailShop(shopId, productId),
      Type.fetchAll()
    ]);
    obj.data.shop_detail = shop[0][0];
    obj.data.shop_detail.product = products;
    obj.data.type = type[0];
    next(obj);
  } catch (err) {
    return next(err);
  }
}

exports.getShop = async (req, res, next) => {
  exports.getShopDetail(req, res, next);
}
