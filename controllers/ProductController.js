const Product = require("../models/Product");
const Type = require("../models/Type");
const Shop = require("../models/Shop");
const Resize = require('../util/resize');
const uuidv1 = require('uuid/v1');
const fs = require("fs");


exports.getIndex = (req, res, next) => {
  const products = Product.testCallback((err, results, fields) => {
    console.log("====callback====");
    console.log(results);
  });
};

exports.getProducts = async (req, res, next) => {
  const obj = { data: {} };
  try {
    const [products, types, shops] = await Promise.all([Product.fetchAll(), Type.fetchAll(), Shop.fetchAll()]);
    obj.data.product = products[0];
    obj.data.type = types[0];
    obj.data.shop = shops[0];
    next(obj);
  } catch (err) {
    return next(err);
  }
};


exports.postAddProduct = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  // res.setHeader('Content-Type', 'application/json')
  // res.write('you posted:\n')
  // res.end(JSON.stringify(req.body, null, 2));

  const productId = null;
  const name = req.body.product_name;
  const unitName = req.body.product_unit_name;
  const desc = req.body.product_desc;
  const price = req.body.product_price;
  const quantity = req.body.product_quantity;
  const rating = req.body.product_rating;
  const typeId = req.body.type_id;
  const isActive = true;
  let imgUrl = '';
  
  if (req.file != undefined) {
    const file = new Resize(req.file); //need to naming in html as "image" from setting multer in fileStorage.js 
    imgUrl =  req.file.destination + '/' + uuidv1() + '.' + req.file.filename.split(".")[1];
    file.save(imgUrl);
  }

  try {
    const product = new Product(productId, name, unitName, desc, price, quantity, imgUrl, rating, typeId, isActive);
    const result = await product.save();
    obj.insertedId = result[0].insertId;
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  // const productId = req.query.productId;
  const productId = req.params.product_id;
  try {
    const result = await Product.findById(productId);
    if (result[0].length == 0) {
      obj.data.product = [];
    } else obj.data.product = result[0];
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.postUpdateProduct = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const productId = req.params.product_id;
  const name = req.body.product_name;
  const unitName = req.body.product_unit_name;
  const desc = req.body.product_desc;
  const price = req.body.product_price;
  const quantity = req.body.product_quantity;
  const rating = req.body.product_rating;
  const typeId = req.body.type_id;
  const isActive = req.body.is_active;

  let imgUrl = req.body.product_img_url;
  let oldImgUrl = imgUrl;
  
  if (req.file != undefined) {
    const file = new Resize(req.file); //need to naming in html as "image" from setting multer in app.js 
    imgUrl =  req.file.destination + '/' + uuidv1() + '.' + req.file.filename.split(".")[1];
    file.save(imgUrl);
    fs.unlink(oldImgUrl, err => { // remove old file
      if (err) {
        //return next(err);
      }
    }); 
  }

  try {
    const product = new Product(productId, name, unitName, desc, price, quantity, imgUrl, rating, typeId, isActive);
    const result = await product.update();
    next(obj);
  } catch (err) {
    return next(err);
  }
    
};

exports.postUpdateRatingProduct = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const productId = req.params.product_id;
  const productRating = req.body.product_rating;

  try {
    const result = await Product.updateRating(productId, productRating);
    obj.insertedId = result[0].insertId;
    next(obj);
  } catch (err) {
    return next(err);
  }
}