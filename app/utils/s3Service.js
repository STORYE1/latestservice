const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

async function uploadToS3(file) {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
}

module.exports = { uploadToS3 };