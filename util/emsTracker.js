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

module.exports = (codes) => {
  data.barcode = codes;
  const promise = new Promise((resolve, reject) => {
    return instance
      .post("/authenticate/token", {}, config)
      .then(response => {
        const token = response.data.token;
        instance.defaults.headers.common["Authorization"] = `Token ${token}`;
        return instance.post("/track", data);
      })
      .then(response => {
        resolve(response.data.response.items);
      })
      .catch(err => {
        reject(err);
        
      });
  });
  return promise;
};