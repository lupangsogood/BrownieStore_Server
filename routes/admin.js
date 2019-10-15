const express = require('express');
const router = express.Router();

router.get('/test', (req, res, next) => {
  res.send('<h1>dsdasdsa</h1>');
});

router.post('/product', (req, res, next) => {
  //console.log(req.body, req.query, req.param);
  res.redirect('/');
});

module.exports = router;