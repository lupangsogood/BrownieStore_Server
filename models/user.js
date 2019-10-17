const db = require('../util/database');
const moment = require('moment');
const momentz = require('moment-timezone');

module.exports = class Users {
  constructor(id, email, password, token, firstname, lastname, address, tel, isSocialLogin, isActive) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.token = token;
    this.firstname = firstname;
    this.lastname = lastname;
    this.address = address;
    this.tel = tel;
    this.isSocialLogin = isSocialLogin;
    this.isActive = isActive;
    this.createdAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    this.updatedAt = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  }

  save() {
    return db.execute(
      "INSERT INTO users (user_email, user_password, user_social_token, user_firstname, user_lastname, user_address, user_tel, created_at, updated_at, is_social_login, is_active) " +
      "SELECT * FROM (SELECT ? AS a, ? AS b, ? AS c, ? AS d, ? AS e, ? AS f, ? AS g, ? AS h, ? AS i, ? AS j, ? AS k) AS tmp " +
      "WHERE NOT EXISTS ( " +
      "SELECT user_email FROM users WHERE user_email = ? ) LIMIT 1 ",
      // "INSERT INTO users (user_email, user_password, user_social_token, user_firstname, user_lastname, user_address, user_tel, created_at, updated_at, is_social_login, is_active) " +
      //   "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        this.email,
        this.password,
        this.token,
        this.firstname,
        this.lastname,
        this.address,
        this.tel,
        this.createdAt,
        this.updatedAt,
        this.isSocialLogin,
        this.isActive,
        this.email //check email is existing
      ]
    );
  }
  static findByEmail(email) {
    return db.execute(
      "SELECT * FROM users WHERE user_email = ? LIMIT 1",
      [email]
    );
  }
}