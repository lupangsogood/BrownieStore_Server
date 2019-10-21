const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const isAuth = require('../util/isAuth');
const Role = require('../models/Role');


const ProductController = require('../controllers/ProductController');
//user and admin
router.get('/product', ProductController.getProducts);
router.get('/product/:product_id', ProductController.getProduct);
router.post('/product/rating/:product_id', ProductController.postUpdateRatingProduct);
//admin
router.post('/product', ProductController.postAddProduct);
router.post('/product/:product_id', ProductController.postUpdateProduct);


// router.get('/', ProductController.getIndex);
// router.post('/product',  (req, res, next) => {
//   req.permissions = [Role.ROLE_USER, Role.ROLE_ADMIN];
//   next();
// }, isAuth, ProductController.postAddProduct);
// router.post('/product/:productId',  (req, res, next) => {
//   req.permissions = [Role.ROLE_USER, Role.ROLE_ADMIN];
//   next();
// }, isAuth, ProductController.postUpdateProduct);

const UserController = require('../controllers/UserController');
//user
router.post('/user/signup', UserController.postSignup);
router.post('/user/login', UserController.postLogin);
router.post('/user/social/login', UserController.postSocialLogin);
router.post('/user/:user_id', UserController.postUpdateUser);


const TypeController = require('../controllers/TypeController');
//user and admin
router.get('/type', TypeController.getTypes);
router.get('/type/:type_id', TypeController.getType);
//admin
router.post('/type', TypeController.postAddType);
router.post('/type/:type_id', TypeController.postUpdateType);


const ShopController = require('../controllers/ShopController');
// user and admin
router.get('/shop', ShopController.getShops);
router.get('/shop/:shop_id', ShopController.getShop);
//admin
router.post('/shop', ShopController.postAddShop);
router.post('/shop/:shop_id', ShopController.postUpdateShop);

const OrderController = require('../controllers/OrderController');
//user
router.get('/order', OrderController.getOrders);
router.get('/order/:order_id', OrderController.getOrder);
router.get('/cart', OrderController.getNewOrder);
router.post('/cart/:order_id', OrderController.postUpdateOrderDetail); // add product to cart
router.post('/order/confirm/:order_id', OrderController.postUpdateUserOrder); // cancel order or submit cart
router.post('/order/payment/:oder_id', OrderController.postPayment);
//admin
router.post('/order/:order_id', OrderController.postUpdateOrder); // update ems, status transfering, cancel
router.post('/order/ems/:order_id', OrderController.postUpdateAutoEmsOrder);

module.exports = router; 
