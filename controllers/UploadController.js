
const AWS = require('aws-sdk');
const fs = require('fs');

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

//configuring the AWS environment
AWS.config.update({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  region: BUCKET_REGION
});
const s3 = new AWS.S3();


//upload
exports.uploadToS3 = async (req, res, next) => {
  // if (req.file != undefined) {
    const result = await new Promise((resolve, reject) => {
      s3.upload({
        Bucket: BUCKET_NAME,
        Body: fs.createReadStream('./package.json'),
        Key: 'package.json',
        //ACL: 'public-read' // Make this object public
      }, (err, data) => err == null ? resolve(data) : reject(err));
    });
    console.log(result.Location);
  // }
}

exports.readObject = async (req, res, next) => {
  let params = {Bucket: BUCKET_NAME, Key: '111.jpg'}
  let file = fs.createWriteStream('111.jpg');
  console.log('====READ====')
  file.on('close', function(){
      console.log('done');  //prints, file created
  });
  s3.getObject(params).createReadStream().on('error', function(err){
      console.log(err);
  }).pipe(file);
}

exports.deleteObject = async (req, res, next) => {
  let params = {Bucket: BUCKET_NAME, Key: 'package.json'}
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);  // error
    else     console.log("Deleted");                 // deleted
  });
}