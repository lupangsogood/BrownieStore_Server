const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../util/config');
const Role = require('../models/Role');

exports.postSignup = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const userId = null;
  const email = req.body.user_email;
  const password = req.body.user_password;
  const token = req.body.user_social_token;
  const firstname = req.body.user_firstname;
  const lastname = req.body.user_lastname;
  const address = req.body.user_address;
  const tel = req.body.user_tel;
  const isSocialLogin = req.body.is_social_login;
  const isActive = true;
  const roleId = Role.ROLE_USER;
  
  try {
    const hashPassword = await hash(password);
    const user = new User(userId, email, hashPassword, token, firstname, lastname, address, tel, roleId, isSocialLogin, isActive);
    const result = await user.save();
    obj.insertedId = result[0].insertId;
    if (obj.insertedId == 0) {
      const error =  new Error("This email has already been used");
      error.statusCode = 401;
      throw error;
    }
    this.postLogin(req, res, next);
  } catch (err) {
    return next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const email = req.body.user_email;
  const password = req.body.user_password;
  let user; 

  try {
    const result = await User.findByEmail(email);
    if (result[0].length == 0) {
      const error =  new Error("Email not found");
      error.statusCode = 401;
      throw error;
    } 
    user = result[0][0];
    const isEqual = await bcrypt.compare(password, user.user_password);
    if (!isEqual) {
      const error = new Error('Your password is incorrect');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({
      user_id: user.user_id, 
      user_email: user.user_email,
      role_id: user.role_id 
    }, config.jwt.secret_key, {expiresIn: config.jwt.expire});

    obj.data.user = filterLoginResponse(user);
    obj.data.user.access_token = token;
    next(obj);
  } catch (err) {
    return next(err);
  }
};

exports.postSocialLogin = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const email = req.body.user_email;
  let firstname = req.body.user_firstname;
  let lastname = req.body.user_lastname;
  const socialToken = req.body.user_social_token;
  const isSocialLogin = true;
  const isActive = true;
  const roleId = Role.ROLE_USER;

  if (!firstname || !lastname) {
    firstname = '';
    lastname = '';
  }

  try {
    const result = await User.findByToken(socialToken);
    let userId;
    if (result[0].length == 0) {
        const user = new User(null, email, null, socialToken, firstname, lastname, null, null, roleId, isSocialLogin, isActive);
        await user.save();
        userId = result[0].insertId;
    } else {
        const user = result[0][0];
        if (user.user_social_token == socialToken && isSocialLogin) {
          if (!user.is_active) {
            const error = new Error('User is locked');
            error.statusCode = 401;
            throw error;
          }
        } else {
          const error = new Error('Can not login with this token');
          error.statusCode = 401;
          throw error;
        }
        userId = user.user_id;
    }

    const token = jwt.sign({
      user_id: userId, 
      user_email: email,
      role_id: roleId 
    }, config.jwt.secret_key, {expiresIn: config.jwt.expire});
    
    obj.data.user = {
      user_id: userId,
      user_email: email,
      user_firstname: firstname,
      user_lastname: lastname,
      user_address: '',
      user_tel: '',
      is_social_login: true,
      is_active: true,
      access_token: token
    }

  } catch (err) {
    return next(err);
  }
  next(obj);
}

exports.postUpdateUser = async (req, res, next) => {
  const obj = { insertedId:0, data: {} };
  const userId = req.params.user_id;
  const firstname = req.body.user_firstname;
  const lastname = req.body.user_lastname;
  const address = req.body.user_address;
  const tel = req.body.user_tel;
  try {
    const user = new User(userId, null, null, null, firstname, lastname, address, tel, null, null, null);
    await user.update();
    next(obj);
  } catch (err) {
    return next(err);
  }
}

const hash = async (password) => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, function(err, hash) {
      if (err) next(err)
      resolve(hash)
    });
  })
}

//filter response
const filterLoginResponse = (user) => {
  delete user.user_password;
  delete user.user_social_token;
  delete user.created_at;
  delete user.updated_at;
  delete user.role_id;
  return user;
};