const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  const products = Product.testCallback((err, results, fields) => {
    console.log("====callback====");
    console.log(results);
  });
  console.log(products);
  res.end();
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fields]) => {
      rows.forEach(row => {
        console.log(row.product_name);
      });
      res.end();
    })
    .catch(err => {
      res.redirect("/500");
    });
};

exports.postAddProduct = (req, res, next) => {
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

  const product = new Product(id, name, unitName, desc, imgUrl, rating, typeId);
  product
    .save()
    .then(rows => {
      //console.log(rows[0].insertId);
      res.redirect("/");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = async (req, res, next) => {
  // const productId = req.query.productId;
  const productId = req.params.productId;
  // const [rows, fields] = await Product.findById(productId);
  // rows.forEach(row => {
  //   console.log(row.product_name);
  // });

  // Product.findById(productId)
  //   .then(rows => {
  //     console.log(rows);
  //   })
  //   .catch(err => {
  //     res.redirect("/500");
  //   });
};
