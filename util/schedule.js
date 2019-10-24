const Order = require("../models/Order");
const tracker = require("../util/emsTracker");
const cron = require("node-cron");

const startUpdateEms = async options => {
  if (!options.time) {
    throw new Error("Please set time schedule for cron job");
  }
  try {
    cron.schedule(options.time, async () => {
      console.log('Checking ems schedule...');
      const orderResult = await Order.findCronJobOrder();
      if (orderResult[0].length < 1) {
        return;
      }

      console.log('======= Start EMS schedule =======');
      // processEmsWithSeq(orderResult); 
      // await processEmsWithPromise(orderResult);
      await processEmsWithSeq(orderResult);
      console.log('======= End EMS schedule =======')

    })
  } catch (err) {
    throw err;
  }
};

// working in each loop
const processEmsWithSeq = async (orderResult) => {
  for(const order of orderResult[0]) {
    console.log('order id : ' + order.order_id + " , ems : " + order.ems_barcode)
    const result = await tracker.fetch([order.ems_barcode]);
    await updateEms(result, order.order_id, order.ems_barcode)
  }
  console.log('process ending')
}

// use promise all : 
const processEmsWithPromise = async (orderResult) => {
  try {
    const promises = orderResult[0].map(async (order, idx) => {
      console.log('order id : ' + order.order_id + " , ems : " + order.ems_barcode)
      const result = await tracker.fetch([order.ems_barcode]);
      await updateEms(result, order.order_id, order.ems_barcode);
    });
    await Promise.all(promises);
    console.log('process ending')
  } catch (err) {
    console.log('Cannot connect ems tracker api !')
  }

}


const updateEms = async (result, orderId, barcode) => {
  let statusId;
  let status;

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
    orderId: orderId,
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
}


module.exports = {
  startUpdateEms
};
