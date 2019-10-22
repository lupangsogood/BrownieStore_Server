const db = require("../util/database");
const filter = require("../util/filter");
const moment = require("moment");
const momentz = require("moment-timezone");

module.exports = class Type {
  constructor(typeId, name, isActive) {
    this.typeId = typeId;
    this.name = name;
    this.isActive = isActive;
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  async save() {
    const data =  await filter.filterData(
      [
        this.name,
        this.createdAt,
        this.updatedAt,
        this.isActive
      ]
    );
    return db.execute(
      "INSERT INTO types (type_name, created_at, updated_at, is_active) " +
        "VALUES (?, ?, ?, ?)", data
    );
  }

  async update() {
    const data =  await filter.filterData(
      [
        this.name,
        this.updatedAt,
        this.isActive,
        this.typeId
      ]
    );
    return db.execute(
      "UPDATE types SET type_name=?, updated_at=?, is_active=? " +
        "WHERE type_id=?", data
    );
  }

  static async fetchAll() {
    return db.execute("SELECT type_id, type_name FROM types WHERE is_active = 1");
  }

  static async findById(typeId) {
    const data =  await filter.filterData([typeId]);
    return db.execute(
      "SELECT * FROM types WHERE types.type_id = ? AND is_active = 1",
      data
    );
  }
}