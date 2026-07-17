const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { uploadImage, uploadThumbnail, uploadDocument, uploadCv, experienceUpload } = require('../middlewares/upload');
const {
  authController,
  aboutController,
  skillController,
  projectController,
  experienceController,
  certificateController,
  socialController,
  cvController,
  settingController,
  dashboardController,
  uploadController,
} = require('../controllers');
const {
  loginValidator,
  changePasswordValidator,
  aboutValidator,
  skillValidator,
  projectValidator,
  experienceValidator,
  socialValidator,
  certificateValidator,
} = require('../validators');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi nanti.' },
});

/* ─── Public Auth ─── */
router.post('/auth/login', authLimiter, loginValidator, validate, authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logout);

/* ─── Public Content ─── */
router.get('/about', aboutController.get);
router.get('/skills', skillController.list);
router.get('/skills/categories', skillController.categories);
router.get('/skills/:id', skillController.get);
router.get('/projects', projectController.list);
router.get('/projects/categories', projectController.categories);
router.get('/projects/slug/:slug', projectController.getBySlug);
router.get('/projects/:id', projectController.get);
router.get('/experiences', experienceController.list);
router.get('/experiences/categories', experienceController.categories);
router.get('/experiences/:id', experienceController.get);
router.get('/certificates', certificateController.list);
router.get('/certificates/:id', certificateController.get);
router.get('/social-links', socialController.list);
router.get('/cv', cvController.getActive);
router.get('/cv/list', cvController.list);
router.post('/cv/:id/download', cvController.download);
router.get('/settings', settingController.list);
router.get('/settings/:key', settingController.get);

/* ─── Protected Admin ─── */
router.use(authenticate);

router.get('/auth/me', authController.me);
router.post('/auth/change-password', changePasswordValidator, validate, authController.changePassword);
router.get('/dashboard', dashboardController.overview);

router.put('/about', aboutValidator, validate, aboutController.upsert);
router.patch('/about/:id', aboutValidator, validate, aboutController.update);

router.post('/skills', skillValidator, validate, skillController.create);
router.put('/skills/:id', skillValidator, validate, skillController.update);
router.delete('/skills/:id', skillController.remove);

router.post('/projects', uploadThumbnail.single('thumbnail'), projectValidator, validate, projectController.create);
router.put('/projects/:id', uploadThumbnail.single('thumbnail'), projectController.update);
router.delete('/projects/:id', projectController.remove);
router.post('/projects/:id/images', uploadImage.single('image'), projectController.addImage);
router.delete('/projects/:id/images/:imageId', projectController.removeImage);

router.post(
  '/experiences',
  experienceUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  experienceValidator,
  validate,
  experienceController.create
);
router.put(
  '/experiences/:id',
  experienceUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  experienceController.update
);
router.delete('/experiences/:id', experienceController.remove);
router.post('/experiences/:id/images', uploadImage.single('image'), experienceController.addImage);
router.delete('/experiences/:id/images/:imageId', experienceController.removeImage);

router.post('/certificates', uploadImage.single('image'), certificateValidator, validate, certificateController.create);
router.put('/certificates/:id', uploadImage.single('image'), certificateController.update);
router.delete('/certificates/:id', certificateController.remove);

router.post('/social-links', socialValidator, validate, socialController.create);
router.put('/social-links/:id', socialController.update);
router.delete('/social-links/:id', socialController.remove);

router.get('/admin/cv', cvController.list);
router.post('/cv', uploadCv.single('file'), cvController.create);
router.put('/cv/:id', uploadCv.single('file'), cvController.update);
router.delete('/cv/:id', cvController.remove);

router.put('/settings/:key', settingController.upsert);

router.post('/upload/:folder', uploadImage.single('file'), uploadController.image);
router.post('/upload/documents', uploadDocument.single('file'), uploadController.image);
router.post('/upload/cv', uploadCv.single('file'), uploadController.image);

module.exports = router;
