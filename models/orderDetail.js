const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");


const EMS_PENDING_STATUS = {id: 1, text: 'PENDING'};
const EMS_WAITING_STATUS = {id: 3, text: 'WAITING'};
const EMS_SHIPPING_STATUS = {id: 4, text: 'SHIPPING'};
const EMS_COMPLETE_STATUS = {id: 5, text: 'COMPLETE'};


module.exports = class DetailOrder {


  



  static get EMS_PENDING_STATUS() {
    return EMS_PENDING_STATUS;
  }
  static get EMS_WAITING_STATUS() {
    return EMS_WAITING_STATUS;
  }
  static get EMS_SHIPPING_STATUS() {
    return EMS_SHIPPING_STATUS;
  }
  static get EMS_COMPLETE_STATUS() {
    return EMS_COMPLETE_STATUS;
  }

}



