const multer = require('multer');

/**
 * Upload Middleware using Memory Storage
 * 
 * Files are stored in memory as Buffer objects.
 * This allows us to upload directly to Supabase Storage
 * without writing to disk first.
 * 
 * Access file data via: req.file.buffer (single) or req.files[i].buffer (multiple)
 */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

module.exports = upload;
