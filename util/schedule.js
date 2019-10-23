const Order = require("../models/Order");
const tracker = require("../util/emsTracker");
const cron = require("node-cron");

const startUpdateEms = async options => {
  if (!options.time) {
    throw new Error("Please set time schedule for cron job");
  }
  try {
    cron.schedule(options.time, async () => {
      console.log('Running schedule...');
      const orderResult = await Order.findCronJobOrder();
      let barcodes = [];
      let statusId;
      let status;

      if (orderResult[0].length < 1) {
        return;
      }

      orderResult[0].forEach(async order => {
        barcodes.push(order.ems_barcode);
      });

      const result = await tracker(barcodes);
      console.log("Calling tracking api : " + barcodes);

      barcodes.forEach((barcode, i) => {

        if (result[barcode].length == 0) {
          return;
        }

        let lastIndex = result[barcode].length - 1;
        let lastStatus = "501";
        if (result[barcode][lastIndex].status == lastStatus) {
          statusId = Order.ORDER_COMPLETE_STATUS.id;
          status = Order.ORDER_COMPLETE_STATUS.text;
        } else {
          statusId = Order.ORDER_SHIPPING_STATUS.id;
          status = Order.ORDER_SHIPPING_STATUS.text;
        }

        const orderInstance = new Order({
          emsBarcode: result[barcode][lastIndex].barcode,
          orderId: orderResult[0][i].order_id,
          statusId: statusId,
          status: status,
          emsStatus: result[barcode][lastIndex].status,
          emsDesc: result[barcode][lastIndex].status_description,
          emsDate: result[barcode][lastIndex].status_date,
          emsLocation: result[barcode][lastIndex].location,
          emsPostCode: result[barcode][lastIndex].postcode,
          emsDeliveryStatus: result[barcode][lastIndex].delivery_status,
          emsDeliveryDesc: result[barcode][lastIndex].delivery_description,
          emsDeliveryDate: result[barcode][lastIndex].delivery_datetime,
          emsReceiver: result[barcode][lastIndex].receiver_name,
          emsSignature: result[barcode][lastIndex].signature
        });
        const updated = orderInstance.updateCronJobOrder();
      });
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  startUpdateEms
};
