const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const isAuth = require('../util/isAuth');
const Role = require('../models/Role');
const fileStorage = require("../util/fileStorage");
const multer = require("multer");

const uploadProduct = multer({ storage: fileStorage.productStorage,  fileFilter: fileStorage.fileFilter });
const uploadSlip = multer({ storage: fileStorage.slipStorage,  fileFilter: fileStorage.fileFilter });

const ProductController = require('../controllers/ProductController');
router.get('/product', ProductController.getProducts);
router.get('/product/:product_id', ProductController.getProduct);

//user
// router.post('/product/rating/:product_id', ProductController.postUpdateRatingProduct);
//admin
// router.post('/product', uploadProduct.single("image"), ProductController.postAddProduct);
// router.post('/product/:product_id', uploadProduct.single("image"), ProductController.postUpdateProduct);


router.post('/product/rating/:product_id',  (req, res, next) => {
  req.permissions = [Role.ROLE_USER];
  next();
}, isAuth, ProductController.postUpdateRatingProduct);

router.post('/product',  (req, res, next) => {
  req.permissions = [Role.ROLE_USER, Role.ROLE_ADMIN];
  next();
}, isAuth, uploadProduct.single("image"), ProductController.postAddProduct);

router.post('/product/:product_id',  (req, res, next) => {
  req.permissions = [Role.ROLE_ADMIN];
  next();
}, isAuth, uploadProduct.single("image"), ProductController.postUpdateProduct);


// ====================================================================

const UserController = require('../controllers/UserController');
//user
router.post('/user/signup', UserController.postSignup);
router.post('/user/login', UserController.postLogin);
router.post('/user/social/login', UserController.postSocialLogin);
router.post('/user/:user_id', UserController.postUpdateUser);

// ====================================================================

const TypeController = require('../controllers/TypeController');
//user and admin
router.get('/type', TypeController.getTypes);
router.get('/type/:type_id', TypeController.getType);
//admin
//router.post('/type', TypeController.postAddType);
//router.post('/type/:type_id', TypeController.postUpdateType);


router.post('/type',  (req, res, next) => {
  req.permissions = [Role.ROLE_ADMIN];
  next();
}, isAuth, TypeController.postAddType);

router.post('/type/:type_id',  (req, res, next) => {
  req.permissions = [Role.ROLE_ADMIN];
  next();
}, isAuth, TypeController.postUpdateType);

// ====================================================================


const ShopController = require('../controllers/ShopController');
// user and admin
router.get('/shop', ShopController.getShops);
router.get('/shop/:shop_id', ShopController.getShop);
//admin
// router.post('/shop', ShopController.postAddShop);
// router.post('/shop/:shop_id', ShopController.postUpdateShop);

router.post('/shop',  (req, res, next) => {
  req.permissions = [Role.ROLE_ADMIN];
  next();
}, isAuth, ShopController.postAddShop);

router.post('/shop/:shop_id',  (req, res, next) => {
  req.permissions = [Role.ROLE_ADMIN];
  next();
}, isAuth, ShopController.postUpdateShop);

// ====================================================================

const OrderController = require('../controllers/OrderController');
//user
// router.get('/order', OrderController.getOrders);
// router.get('/order/:order_id', OrderController.getOrder);
// router.get('/cart', OrderController.getNewOrder);
// router.post('/cart/:order_id', OrderController.postUpdateOrderDetail); // add product to cart
// router.post('/order/payment/:order_id', uploadSlip.single("image"), OrderController.postPayment);
// //admin
// router.post('/order/status/:order_id', OrderController.postUpdateOrder); // update ems, status, cancel

router.get('/order', isAuth, OrderController.getOrders);
router.get('/order/:order_id', isAuth, OrderController.getOrder);
router.post('/order/status/:order_id', isAuth, OrderController.postUpdateOrder); // update ems, status, cancel

router.get('/cart',  (req, res, next) => {
  req.permissions = [Role.ROLE_USER];
  next();
}, isAuth, OrderController.getNewOrder);

router.post('/cart/:order_id',  (req, res, next) => {
  req.permissions = [Role.ROLE_USER];
  next();
}, isAuth, OrderController.postSaveOrderDetail);

router.post('/cart_update/:order_id',  (req, res, next) => {
  req.permissions = [Role.ROLE_USER];
  next();
}, isAuth, OrderController.postUpdateOrderDetail);



// router.post('/order/payment/:order_id',  (req, res, next) => {
//   req.permissions = [Role.ROLE_USER];
//   next();
// }, isAuth, uploadSlip.single("image"), OrderController.postPayment);


router.post('/order/payment/:order_id',  (req, res, next) => {
  req.permissions = [Role.ROLE_USER];
  next();
}, isAuth, OrderController.postPayment);



// ====================================================================

const TrackingController = require('../controllers/TrackingController');
router.get('/tracking/:trackingCode', TrackingController.getTracking);

// const UploadController = require('../controllers/UploadController');
// router.get('/test/upload', UploadController.uploadToS3);
// router.get('/test/read', UploadController.readObject);
// router.get('/test/delete', UploadController.deleteObject);




module.exports = router; 
