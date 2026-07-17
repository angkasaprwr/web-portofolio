const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ApiError } = require('../utils/response');
const config = require('../config');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const createUploader = (folder) => {
  const uploadPath = path.resolve(__dirname, '../../../uploads', folder);
  ensureDir(uploadPath);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${unique}${ext}`);
    },
  });

  const fileFilter = (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype) || file.mimetype.includes('document') || file.mimetype.includes('pdf');
    if (ext || mime) return cb(null, true);
    cb(new ApiError(400, 'Tipe file tidak diizinkan'));
  };

  return multer({
    storage,
    limits: { fileSize: config.upload.maxFileSize },
    fileFilter,
  });
};

const experienceUpload = (() => {
  const thumbPath = path.resolve(__dirname, '../../../uploads/thumbnails');
  const docPath = path.resolve(__dirname, '../../../uploads/documents');
  ensureDir(thumbPath);
  ensureDir(docPath);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'document') return cb(null, docPath);
      return cb(null, thumbPath);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${unique}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: config.upload.maxFileSize },
  });
})();

module.exports = {
  uploadImage: createUploader('images'),
  uploadThumbnail: createUploader('thumbnails'),
  uploadDocument: createUploader('documents'),
  uploadCv: createUploader('cv'),
  uploadTemp: createUploader('temp'),
  experienceUpload,
};
