const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME;
if (!bucketName) {
    console.error('Error: S3_BUCKET_NAME is not defined in environment variables.');
    process.exit(1);
}

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/webm",
];

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `media/${Date.now()}-${file.originalname}`);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("File type is not supported"), false);
        }
        cb(null, true);
    },
});

const uploadMiddleware = upload.fields([
    { name: 'media', maxCount: 10 },
    { name: 'leader_profile_pic', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 },
]);

const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
};

module.exports = {
    uploadMiddleware,
    handleUploadErrors,
};
