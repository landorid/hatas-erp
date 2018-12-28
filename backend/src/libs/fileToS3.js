const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3();

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    cacheControl: 'max-age=31536000',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: 'Profile picture' });
    },
    key: function(req, file, cb) {
      cb(null,`avatar/${file.originalname}`);
    },
  }),
});
