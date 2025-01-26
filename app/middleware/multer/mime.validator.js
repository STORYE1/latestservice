const multer = require("multer");

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/webm",
];

const upload = multer({

    limits: { fileSize: 50 * 1024 * 1024 },

    fileFilter: function (req, file, done) {
        try {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return done(new Error("File type is not supported"), false);
            }


            done(null, true);
        } catch (err) {

            console.error("Error in file filter:", err);
            done(err, false);
        }
    },
});

const handleError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
};

module.exports = { upload, handleError };
