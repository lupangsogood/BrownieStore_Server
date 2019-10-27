
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
exports.upload = async (filePath, fileName) => {
  const result = await new Promise((resolve, reject) => {
    s3.upload({
      Bucket: BUCKET_NAME,
      Body: fs.createReadStream(filePath),
      Key: fileName,
      ACL: 'public-read' // Make this object public
    }, (err, data) => err == null ? resolve(data) : reject(err));
  });
  fs.unlink(filePath, err => {
    if (err) throw err;
    //console.log('file deleted');
  });
  return result;
}



exports.delete = async (filePath) => {
  let params = {Bucket: BUCKET_NAME, Key: filePath}
  const result = await new Promise((resolve, reject) => {
    s3.deleteObject(params, 
      (err, data) => err == null ? resolve(data) : reject(err));
  });


}