const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();


//controller
const apiControllers = require('../controllers/apiController');

router.get('/',(req, res, next) => res.end());
router.get('/api', apiControllers.getIndex);
router.get('/api/products', apiControllers.getProducts);
router.get('/api/product/:productId', apiControllers.getProduct);
router.post('/api/product', apiControllers.postAddProduct);



module.exports = router; 