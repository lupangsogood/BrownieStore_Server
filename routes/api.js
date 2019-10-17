const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();


//controller
const productController = require('../controllers/productController');
router.get('/', productController.getIndex);
router.get('/product', productController.getProducts);
router.get('/product/:productId', productController.getProduct);
router.post('/product', productController.postAddProduct);
router.post('/product/:productId', productController.updateProduct);

const userController = require('../controllers/userController');
router.post('/user/signup', userController.postSignup);
router.post('/user/login', userController.postLogin);
router.post('/user/social/login', userController.postUserLogin);


module.exports = router; 