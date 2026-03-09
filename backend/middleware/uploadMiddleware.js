const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage so we can upload directly to Cloudinary (avoids ephemeral disk issues on Render)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload, cloudinary };
