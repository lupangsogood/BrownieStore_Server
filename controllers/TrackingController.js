const tracker = require('../util/emsTracker');

exports.getTracking = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const code = req.params.trackingCode;
  const trackerCodes = [];
  trackerCodes.push(code);
  try {
    const result = await tracker.fetch(trackerCodes);
    obj.data.ems = result;
    next(obj);
  } catch (err) {
    return next(err);
  }
}