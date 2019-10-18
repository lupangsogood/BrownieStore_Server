const Type = require("../models/type");

exports.getTypes = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  try {
    const result = await Type.fetchAll();
    obj.data.type = result[0];
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.getType = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const typeId = req.params.typeId;
  try {
    const result = await Type.findById(typeId);
    if (result[0].length == 0) {
      obj.data.type = {};
    } else obj.data.type = result[0][0];
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.postAddType = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const typeId = null;
  const name = req.body.type_name;
  const isActive = true;
  try {
    const type = new Type(typeId, name, isActive);
    const result = await type.save();
    obj.insertedId = result[0].insertId;
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.postUpdateType = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const typeId = req.params.typeId;
  const name = req.body.type_name;
  const isActive = req.body.is_active;
  try {
    const type = new Type(typeId, name, isActive);
    const result = await type.update();
    next(obj);
  } catch (err) {
    return next(err);
  }
};

