const Order = require("../models/Order");
const cron = require('node-cron');
const startUpdateEms = (options) => {
  if (!options.time) {
    throw new Error('Please set time schedule for cron job');
  }
  cron.schedule(options.time, () => {
    console.log('schedule');
    
  });

}
module.exports = {
  startUpdateEms
}