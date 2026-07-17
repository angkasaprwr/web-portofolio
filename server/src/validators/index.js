const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Password saat ini wajib diisi'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password baru minimal 8 karakter'),
];

const aboutValidator = [
  body('fullName').optional().isString().trim().notEmpty(),
  body('profession').optional().isString().trim().notEmpty(),
  body('bio').optional().isString().trim().notEmpty(),
];

const skillValidator = [
  body('name').notEmpty().withMessage('Nama skill wajib diisi'),
  body('category').notEmpty().withMessage('Kategori wajib diisi'),
  body('level').optional().isInt({ min: 0, max: 100 }),
];

const projectValidator = [
  body('title').notEmpty().withMessage('Judul project wajib diisi'),
  body('category').notEmpty().withMessage('Kategori wajib diisi'),
  body('description').notEmpty().withMessage('Deskripsi wajib diisi'),
];

const experienceValidator = [
  body('title').notEmpty().withMessage('Judul wajib diisi'),
  body('company').notEmpty().withMessage('Instansi wajib diisi'),
  body('type').isIn(['Formal', 'Informal']).withMessage('Tipe harus Formal atau Informal'),
  body('category').notEmpty().withMessage('Kategori wajib diisi'),
  body('description').notEmpty().withMessage('Deskripsi wajib diisi'),
  body('startDate').notEmpty().withMessage('Tanggal mulai wajib diisi'),
];

const socialValidator = [
  body('platform').notEmpty().withMessage('Platform wajib diisi'),
  body('url')
    .notEmpty()
    .withMessage('URL wajib diisi')
    .custom((value) => {
      const ok =
        /^https?:\/\//i.test(value) ||
        /^mailto:/i.test(value) ||
        /^tel:/i.test(value);
      if (!ok) throw new Error('URL tidak valid');
      return true;
    }),
];

const certificateValidator = [
  body('title').notEmpty().withMessage('Judul wajib diisi'),
  body('issuer').notEmpty().withMessage('Penerbit wajib diisi'),
];

module.exports = {
  loginValidator,
  changePasswordValidator,
  aboutValidator,
  skillValidator,
  projectValidator,
  experienceValidator,
  socialValidator,
  certificateValidator,
};
