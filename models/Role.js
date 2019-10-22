
const ROLE_USER = 1;
const ROLE_ADMIN = 2;

module.exports = class Role {
  static get ROLE_USER() {
    return ROLE_USER;
  }
  static get ROLE_ADMIN() {
    return ROLE_ADMIN;
  }
}