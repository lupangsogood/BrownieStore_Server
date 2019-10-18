const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const isAuth = require('../util/isAuth');
const Role = require('../models/role');


//controller
const productController = require('../controllers/productController');
// router.get('/', productController.getIndex);
router.get('/product', productController.getProducts);
router.get('/product/:productId', productController.getProduct);
// router.post('/product',  (req, res, next) => {
//   req.permissions = [Role.ROLE_USER, Role.ROLE_ADMIN];
//   next();
// }, isAuth, productController.postAddProduct);
router.post('/product', productController.postAddProduct);
// router.post('/product/:productId',  (req, res, next) => {
//   req.permissions = [Role.ROLE_USER, Role.ROLE_ADMIN];
//   next();
// }, isAuth, productController.postUpdateProduct);
router.post('/product/:productId', productController.postUpdateProduct);

const userController = require('../controllers/userController');
router.post('/user/signup', userController.postSignup);
router.post('/user/login', userController.postLogin);
router.post('/user/social/login', userController.postSocialLogin);
router.post('/user/:userId', userController.postUpdateUser);


const typeController = require('../controllers/typeController');
router.get('/type', typeController.getTypes);
router.get('/type/:typeId', typeController.getType);
router.post('/type', typeController.postAddType);
router.post('/type/:typeId', typeController.postUpdateType);


module.exports = router; 