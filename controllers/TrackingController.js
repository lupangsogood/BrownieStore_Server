const Order = require("../models/Order");
const axios = require('axios');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const instance = axios.create({
  baseURL: process.env.EMS_HOST,
  method: 'POST'
});
let data = {
  status: 'all',
  language: 'TH',
  barcode: []
};
let config = {
  headers: {
    Authorization: `Token ${process.env.EMS_TOKEN}`
  }
}


exports.getTracking = (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const trackingCode = req.params.trackingCode;
  data.barcode.push(trackingCode);
  instance
    .post('/authenticate/token',{}, config)
    .then((response) => {
      const token = response.data.token;
      instance.defaults.headers.common['Authorization'] = `Token ${token}`;
      return instance.post("/track", data);
    })
    .then((response) => {
      obj.data.tracking = response.data.response.items;
    })
    .catch((err) => {
      return next(err);
    })
    .finally(() => {
      next(obj);
    })
    
}