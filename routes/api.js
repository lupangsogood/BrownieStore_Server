const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();


//controller
const apiControllers = require('../controllers/apiController');

router.get('/', apiControllers.getIndex);
router.get('/product', apiControllers.getProducts);
router.get('/product/:productId', apiControllers.getProduct);
router.post('/product', apiControllers.postAddProduct);
router.post('/product/:productId', apiControllers.updateProduct);



module.exports = router; 