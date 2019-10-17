const jwt = require('jsonwebtoken');
const config = require('../util/config');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('No Header authenticated.');
    error.statusCode = 401
    return next(error);
  }

  let decodedToken;
  try {
    const token = authHeader.split(' ')[1];
    decodedToken = jwt.verify(token, config.jwt.secret_key);
  } catch (err) {
    err.statusCode = 401
    return next(err);
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401
    return next(error);
  }
  
  req.user_id = decodedToken.user_id;
  req.role_id = decodedToken.role_id;

  let isAccess = true;
  if (req.permissions) {
    isAccess = req.permissions.find(roleId => {
      return  roleId == req.role_id;
    });
  }
  if (!isAccess) {
    const error = new Error('You don\'t have permission.');
    error.statusCode = 401
    return next(error);
  }

  

  next(); 
};



async function test() {
  // callback
    // setTimeout(() => {
    //   console.log('done!'); 
    // }, 2000);

  
  //convert call back to promise
  const promise = new Promise((resolve, reject) => {
    return setTimeout(() => { 
      if(Math.random() >= 0.5) resolve('resolve : BabelCoder!')
      else reject('reject : Less than 0.5!')
    }, 2000);
  });
  
  
  // promise.then((text) => {
  //   console.log('resolve: '+ text);
  //   console.log('done !');
  // }).catch((error) => {
  //   console.error('reject: ' + error.message);
  //   console.log('done !');
  // })

  // await work for promise function
  try {
    console.log(await promise);
  } catch (err) {
    console.log(err);
  }
  console.log('done !');
}