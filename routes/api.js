const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const isAuth = require('../util/isAuth');
const Role = require('../models/Role');


//controller
const ProductController = require('../controllers/ProductController');
router.get('/product', ProductController.getProducts);
router.get('/product/:productId', ProductController.getProduct);
router.post('/product', ProductController.postAddProduct);
router.post('/product/:productId', ProductController.postUpdateProduct);
router.post('/product/rating/:productId', ProductController.postUpdateRatingProduct);

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
router.post('/user/signup', UserController.postSignup);
router.post('/user/login', UserController.postLogin);
router.post('/user/social/login', UserController.postSocialLogin);
router.post('/user/:userId', UserController.postUpdateUser);


const TypeController = require('../controllers/TypeController');
router.get('/type', TypeController.getTypes);
router.get('/type/:typeId', TypeController.getType);
router.post('/type', TypeController.postAddType);
router.post('/type/:typeId', TypeController.postUpdateType);


const ShopController = require('../controllers/ShopController');
router.get('/shop', ShopController.getShops);
router.get('/shop/:shopId', ShopController.getShop);
router.post('/shop', ShopController.postAddShop);
router.post('/shop/:shopId', ShopController.postUpdateShop);

const OrderController = require('../controllers/OrderController');
router.get('/order', OrderController.getOrders);
router.get('/order/:orderId', OrderController.getOrder);
router.post('/order/:orderId', OrderController.postUpdateOrder)
router.get('/cart', OrderController.getNewOrder);
router.post('/cart', OrderController.postUpdateOrderDetail); //Update order detail
router.post('/cart/confirm', OrderController.postConfirmOrder);

module.exports = router; 
