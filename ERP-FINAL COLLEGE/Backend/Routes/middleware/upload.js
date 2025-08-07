const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloud=require('./cloudinary');


const storage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: 'student_uploads', // optional folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'docx'],
    public_id: (req, file) => {
      return file.fieldname + '-' + Date.now();
    }
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
