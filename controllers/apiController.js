const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  const products = Product.testCallback((err, results, fields) => {
    console.log("====callback====");
    console.log(results);
  });
};

exports.getProducts = (req, res, next) => {
  const data = {};
  Product.fetchAll()
    .then(([rows, fields]) => {
      // rows.forEach(row => {
      //   console.log(row.product_name);
      // });
      data.data = rows;
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      data.error = error;
    })
    .finally(() => {
      return next(data);
    })

};


exports.postAddProduct = (req, res, next) => {
  const data = {};
  // res.setHeader('Content-Type', 'application/json')
  // res.write('you posted:\n')
  // res.end(JSON.stringify(req.body, null, 2));

  const id = null;
  const name = req.body.product_name;
  const unitName = req.body.product_unit_name;
  const desc = req.body.product_desc;
  const imgUrl = req.body.product_img_url;
  const rating = req.body.product_rating;
  const typeId = req.body.type_id;
  const isActive = true;

  const product = new Product(id, name, unitName, desc, imgUrl, rating, typeId, isActive);
  product
    .save()
    .then(([row, fields]) => {
      data.data = row.insertId;
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      data.error = error;
    })
    .finally(() => {
      return next(data);
    })

};

exports.getProduct = async (req, res, next) => {
  const data = {};
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
        data.data = {};
      } else data.data = rows[0];d
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      data.error = error;
    })
    .finally(() => {
      return next(data);
    })
};

exports.updateProduct = (req, res, next) => {
  const data = {};
  const id = req.params.productId;

  const name = req.body.product_name;
  const unitName = req.body.product_unit_name;
  const desc = req.body.product_desc;
  const imgUrl = req.body.product_img_url;
  const rating = req.body.product_rating;
  const typeId = req.body.type_id;
  const isActive = req.body.is_active;

  const product = new Product(id, name, unitName, desc, imgUrl, rating, typeId, isActive);
  product
    .update()
    .then(rows => {
      data.data = rows[0].affectedRows;
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.message = err.message;
      data.error = error;
    })
    .finally(() => {
      return next(data);
    })
    
};
