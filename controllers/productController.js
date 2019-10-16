const Product = require("../models/product");
const Resize = require('../util/Resize');
const uuidv1 = require('uuid/v1');
const fs = require("fs");

exports.getIndex = (req, res, next) => {
  const products = Product.testCallback((err, results, fields) => {
    console.log("====callback====");
    console.log(results);
  });
};

exports.getProducts = (req, res, next) => {
  const obj = { data: {} };
  Product.fetchAll()
    .then(([rows, fields]) => {
      // rows.forEach(row => {
      //   console.log(row.product_name);
      // });
      obj.data.product = rows;
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      obj.error = error;
    })
    .finally(() => {
      return next(obj);
    })

};


exports.postAddProduct = (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  // res.setHeader('Content-Type', 'application/json')
  // res.write('you posted:\n')
  // res.end(JSON.stringify(req.body, null, 2));

  const id = null;
  const name = req.body.product_name;
  const unitName = req.body.product_unit_name;
  const desc = req.body.product_desc;
  const rating = req.body.product_rating;
  const typeId = req.body.type_id;
  const isActive = true;
  let imgUrl = '';
  
  if (req.file != undefined) {
    const file = new Resize(req.file); //need to naming in html as "image" from setting multer in app.js 
    imgUrl =  req.file.destination + '/' + uuidv1() + '.' + req.file.filename.split(".")[1];
    file.save(imgUrl);
  }

  const product = new Product(id, name, unitName, desc, imgUrl, rating, typeId, isActive);
  product
    .save()
    .then(([row, fields]) => {
      obj.insertedId = row.insertId;
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      obj.error = error;
    })
    .finally(() => {
      return next(obj);
    })

};

exports.getProduct = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  // const productId = req.query.productId;
  const productId = req.params.productId;
  // try {
  //   const [rows, fields] = await Product.findById(productId);
  //   rows.forEach(row => {
  //     console.log(row.product_name);
  //   });
  // } catch (err) {
  //   const error = new Error(err);
  //   error.httpStatusCode = 500;
  //   return next(error);
  // }

  Product.findById(productId)
    .then(rows => {
      if (rows[0].length == 0) {
        obj.data.product = {};
      } else obj.data.product = rows[0];
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      obj.error = error;
    })
    .finally(() => {
      return next(obj);
    })
};

exports.updateProduct = (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const id = req.params.productId;

  const name = req.body.product_name;
  const unitName = req.body.product_unit_name;
  const desc = req.body.product_desc;
  const rating = req.body.product_rating;
  const typeId = req.body.type_id;
  const isActive = true;

  let imgUrl = req.body.product_img_url;
  let oldImgUrl = imgUrl;
  
  if (req.file != undefined) {
    const file = new Resize(req.file); //need to naming in html as "image" from setting multer in app.js 
    imgUrl =  req.file.destination + '/' + uuidv1() + '.' + req.file.filename.split(".")[1];
    file.save(imgUrl);
    fs.unlink(oldImgUrl, err => { // remove old file
      //console.log(err);
    }); 
  }

  const product = new Product(id, name, unitName, desc, imgUrl, rating, typeId, isActive);
  product
    .update()
    .then(rows => {
      // console.log('Update : ' + rows[0].affectedRows);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      obj.error = error;
    })
    .finally(() => {
      return next(obj);
    })
    
};
