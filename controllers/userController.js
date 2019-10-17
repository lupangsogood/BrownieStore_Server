const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../util/config');

exports.postSignup = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const id = null;
  const email = req.body.user_email;
  const password = req.body.user_password;
  const token = req.body.user_social_token;
  const firstname = req.body.user_firstname;
  const lastname = req.body.user_lastname;
  const address = req.body.user_address;
  const tel = req.body.user_tel;
  const isSocialLogin = req.body.is_social_login;
  const isActive = true;
  
  const hash = async (password) => {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, 12, function(err, hash) {
        if (err) next(err)
        resolve(hash)
      });
    })
  }
  const hashPassword = await hash(password);

  const user = new User(id, email, hashPassword, token, firstname, lastname, address, tel, isSocialLogin, isActive);
  user
    .save()
    .then(([row, fields]) => {
      obj.insertedId = row.insertId;
      if (obj.insertedId == 0) {
        const error =  new Error("This email has already been used");
        error.statusCode = 401;
        throw error;
      }
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = err.statusCode
      error.message = err.message;
      obj.error = error;
    })
    .finally(() => {
      if (obj.error) {
        return next(obj);
      }
      this.postLogin(req, res, next);
    });
};

exports.postLogin = (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const email = req.body.user_email;
  const password = req.body.user_password;
  let user; 
  User.findByEmail(email)
    .then(rows => {
      if (rows[0].length == 0) {
        const error =  new Error("Email not found");
        error.statusCode = 401;
        throw error;
      } 
      user = rows[0][0];
      return bcrypt.compare(password, user.user_password);
    })
    .then(isEqual => {
        if (!isEqual) {
          const error = new Error('Your password is incorrect');
          error.statusCode = 401;
          throw error;
        }
        const token = jwt.sign({
          id: user.id, 
          user_email: user.user_email, 
        }, config.jwt.secret_key, {expiresIn: config.jwt.expire});
        obj.data.user = filterLoginResponse(user);
        obj.data.user.access_token = token;
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = err.statusCode
      error.message = err.message;
      obj.error = error;
    })
    .finally(() => {
      return next(obj);
    })
};

exports.postUserLogin = (req, res, next) => {
  const obj = { insertedId:0, data: {} };
};

//filter response
const filterLoginResponse = (user) => {
  delete user.user_password;
  delete user.user_social_token;
  delete user.created_at;
  delete user.updated_at;
  delete user.role_id;
  return user;
};