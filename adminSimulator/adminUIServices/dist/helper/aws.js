"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aws = void 0;
const dotenv = require("dotenv");
const path = require("path");
const AWS = require('aws-sdk');
const fs = require("fs");
if (fs.existsSync(path.join(__dirname, "..", "..", ".env"))) {
    dotenv.config();
}
AWS.config.update({
    signatureVersion: 'v4'
});
const S3_BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION;
const URL_EXPIRATION_TIME = 180;
const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
});
class Aws {
    static getUrlFromS3(keyString) {
        return new Promise((resolve, reject) => {
            myBucket.getSignedUrl('getObject', {
                Key: keyString,
                Expires: URL_EXPIRATION_TIME * 5,
            }, (err, url) => {
                if (err) {
                    resolve(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    }
}
exports.Aws = Aws;
//# sourceMappingURL=aws.js.map