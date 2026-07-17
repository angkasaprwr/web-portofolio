const authService = require('../services/authService');
const {
  aboutService,
  skillService,
  projectService,
  experienceService,
  educationService,
  certificateService,
  socialService,
  cvService,
  settingService,
  dashboardService,
} = require('../services');
const { asyncHandler, successResponse } = require('../utils/response');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const parseMaybeJsonArray = (value) => {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* fallthrough */
    }
    return value.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return value;
};

const coerceBool = (value) => {
  if (value === true || value === false) return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const coerceProjectBody = (body) => {
  const next = { ...body };
  if (next.techStack !== undefined) next.techStack = parseMaybeJsonArray(next.techStack);
  if (next.featured !== undefined) next.featured = coerceBool(next.featured);
  if (next.isActive !== undefined) next.isActive = coerceBool(next.isActive);
  if (next.order !== undefined) next.order = Number(next.order) || 0;
  if (next.startDate === '') next.startDate = null;
  if (next.endDate === '') next.endDate = null;
  return next;
};

const coerceExperienceBody = (body) => {
  const next = { ...body };
  if (next.skills !== undefined) next.skills = parseMaybeJsonArray(next.skills);
  if (next.isCurrent !== undefined) next.isCurrent = coerceBool(next.isCurrent);
  if (next.isActive !== undefined) next.isActive = coerceBool(next.isActive);
  if (next.order !== undefined) next.order = Number(next.order) || 0;
  if (next.endDate === '') next.endDate = null;
  return next;
};

/* Auth */
const authController = {
  login: asyncHandler(async (req, res) => {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
    });
    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    return successResponse(res, {
      message: 'Login berhasil',
      data: { accessToken: result.accessToken, admin: result.admin },
    });
  }),
  refresh: asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await authService.refresh(token);
    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    return successResponse(res, {
      message: 'Token diperbarui',
      data: { accessToken: result.accessToken, admin: result.admin },
    });
  }),
  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.cookies.refreshToken, req.admin?.id, req.ip);
    res.clearCookie('refreshToken', { path: '/' });
    return successResponse(res, { message: 'Logout berhasil' });
  }),
  me: asyncHandler(async (req, res) => {
    const admin = await authService.me(req.admin.id);
    return successResponse(res, { data: admin });
  }),
  changePassword: asyncHandler(async (req, res) => {
    await authService.changePassword(req.admin.id, req.body);
    res.clearCookie('refreshToken', { path: '/' });
    return successResponse(res, { message: 'Password berhasil diubah. Silakan login kembali.' });
  }),
};

/* About */
const aboutController = {
  get: asyncHandler(async (_req, res) => {
    const data = await aboutService.get();
    return successResponse(res, { data });
  }),
  upsert: asyncHandler(async (req, res) => {
    const data = await aboutService.upsert(req, req.body);
    return successResponse(res, { message: 'Data tentang saya disimpan', data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await aboutService.update(req, req.params.id, req.body);
    return successResponse(res, { message: 'Data diperbarui', data });
  }),
};

/* Skills */
const skillController = {
  list: asyncHandler(async (req, res) => {
    const { data, meta } = await skillService.list(req.query);
    return successResponse(res, { data, meta });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await skillService.getById(req.params.id);
    return successResponse(res, { data });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await skillService.create(req, req.body);
    return successResponse(res, { statusCode: 201, message: 'Skill ditambahkan', data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await skillService.update(req, req.params.id, req.body);
    return successResponse(res, { message: 'Skill diperbarui', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await skillService.remove(req, req.params.id);
    return successResponse(res, { message: 'Skill dihapus' });
  }),
  categories: asyncHandler(async (_req, res) => {
    const data = await skillService.categories();
    return successResponse(res, { data });
  }),
};

/* Projects */
const projectController = {
  list: asyncHandler(async (req, res) => {
    const { data, meta } = await projectService.list(req.query);
    return successResponse(res, { data, meta });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await projectService.getById(req.params.id);
    return successResponse(res, { data });
  }),
  getBySlug: asyncHandler(async (req, res) => {
    const data = await projectService.getBySlug(req.params.slug);
    return successResponse(res, { data });
  }),
  create: asyncHandler(async (req, res) => {
    const body = coerceProjectBody(req.body);
    if (req.file) body.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
    const data = await projectService.create(req, body);
    return successResponse(res, { statusCode: 201, message: 'Project ditambahkan', data });
  }),
  update: asyncHandler(async (req, res) => {
    const body = coerceProjectBody(req.body);
    if (req.file) body.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
    const data = await projectService.update(req, req.params.id, body);
    return successResponse(res, { message: 'Project diperbarui', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await projectService.remove(req, req.params.id);
    return successResponse(res, { message: 'Project dihapus' });
  }),
  addImage: asyncHandler(async (req, res) => {
    if (!req.file) throw Object.assign(new Error('File diperlukan'), { statusCode: 400 });
    const url = `/uploads/images/${req.file.filename}`;
    const data = await projectService.addImage(req, req.params.id, url, req.body.caption);
    return successResponse(res, { statusCode: 201, message: 'Gambar ditambahkan', data });
  }),
  removeImage: asyncHandler(async (req, res) => {
    await projectService.removeImage(req, req.params.imageId);
    return successResponse(res, { message: 'Gambar dihapus' });
  }),
  categories: asyncHandler(async (_req, res) => {
    const data = await projectService.categoryStats();
    return successResponse(res, { data });
  }),
};

/* Experiences */
const experienceController = {
  list: asyncHandler(async (req, res) => {
    const { data, meta } = await experienceService.list(req.query);
    return successResponse(res, { data, meta });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await experienceService.getById(req.params.id);
    return successResponse(res, { data });
  }),
  create: asyncHandler(async (req, res) => {
    const body = coerceExperienceBody(req.body);
    if (req.files?.thumbnail?.[0]) body.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    if (req.files?.document?.[0]) body.documentUrl = `/uploads/documents/${req.files.document[0].filename}`;
    const data = await experienceService.create(req, body);
    return successResponse(res, { statusCode: 201, message: 'Pengalaman ditambahkan', data });
  }),
  update: asyncHandler(async (req, res) => {
    const body = coerceExperienceBody(req.body);
    if (req.files?.thumbnail?.[0]) body.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    if (req.files?.document?.[0]) body.documentUrl = `/uploads/documents/${req.files.document[0].filename}`;
    const data = await experienceService.update(req, req.params.id, body);
    return successResponse(res, { message: 'Pengalaman diperbarui', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await experienceService.remove(req, req.params.id);
    return successResponse(res, { message: 'Pengalaman dihapus' });
  }),
  addImage: asyncHandler(async (req, res) => {
    const url = `/uploads/images/${req.file.filename}`;
    const data = await experienceService.addImage(req, req.params.id, url, req.body.caption);
    return successResponse(res, { statusCode: 201, message: 'Gambar ditambahkan', data });
  }),
  removeImage: asyncHandler(async (req, res) => {
    await experienceService.removeImage(req, req.params.imageId);
    return successResponse(res, { message: 'Gambar dihapus' });
  }),
  categories: asyncHandler(async (_req, res) => {
    const data = await experienceService.categoryStats();
    return successResponse(res, { data });
  }),
};

/* Education */
const educationController = {
  list: asyncHandler(async (req, res) => {
    const data = await educationService.list(req.query);
    return successResponse(res, { data });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await educationService.getById(req.params.id);
    return successResponse(res, { data });
  }),
  create: asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (body.isCurrent === 'true') body.isCurrent = true;
    if (body.isCurrent === 'false') body.isCurrent = false;
    if (body.order !== undefined) body.order = Number(body.order) || 0;
    if (body.isActive === 'true') body.isActive = true;
    if (body.isActive === 'false') body.isActive = false;
    const data = await educationService.create(req, body);
    return successResponse(res, { statusCode: 201, message: 'Pendidikan ditambahkan', data });
  }),
  update: asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (body.isCurrent === 'true') body.isCurrent = true;
    if (body.isCurrent === 'false') body.isCurrent = false;
    if (body.order !== undefined) body.order = Number(body.order) || 0;
    if (body.isActive === 'true') body.isActive = true;
    if (body.isActive === 'false') body.isActive = false;
    const data = await educationService.update(req, req.params.id, body);
    return successResponse(res, { message: 'Pendidikan diperbarui', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await educationService.remove(req, req.params.id);
    return successResponse(res, { message: 'Pendidikan dihapus' });
  }),
};

/* Certificates */
const certificateController = {
  list: asyncHandler(async (req, res) => {
    const { data, meta } = await certificateService.list(req.query);
    return successResponse(res, { data, meta });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await certificateService.getById(req.params.id);
    return successResponse(res, { data });
  }),
  create: asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (req.file) body.image = `/uploads/images/${req.file.filename}`;
    const data = await certificateService.create(req, body);
    return successResponse(res, { statusCode: 201, message: 'Sertifikat ditambahkan', data });
  }),
  update: asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (req.file) body.image = `/uploads/images/${req.file.filename}`;
    const data = await certificateService.update(req, req.params.id, body);
    return successResponse(res, { message: 'Sertifikat diperbarui', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await certificateService.remove(req, req.params.id);
    return successResponse(res, { message: 'Sertifikat dihapus' });
  }),
};

/* Social */
const socialController = {
  list: asyncHandler(async (req, res) => {
    const data = await socialService.list(req.query);
    return successResponse(res, { data });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await socialService.getById(req.params.id);
    return successResponse(res, { data });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await socialService.create(req, req.body);
    return successResponse(res, { statusCode: 201, message: 'Social link ditambahkan', data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await socialService.update(req, req.params.id, req.body);
    return successResponse(res, { message: 'Social link diperbarui', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await socialService.remove(req, req.params.id);
    return successResponse(res, { message: 'Social link dihapus' });
  }),
};

/* CV */
const cvController = {
  list: asyncHandler(async (req, res) => {
    const data = await cvService.list(req.query);
    return successResponse(res, { data });
  }),
  getActive: asyncHandler(async (_req, res) => {
    const data = await cvService.getActive();
    return successResponse(res, { data });
  }),
  create: asyncHandler(async (req, res) => {
    if (!req.file) {
      const { ApiError } = require('../utils/response');
      throw new ApiError(400, 'File CV diperlukan');
    }
    const data = await cvService.create(req, {
      title: req.body.title || req.file.originalname,
      fileName: req.file.originalname,
      fileUrl: `/uploads/cv/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      version: req.body.version,
      isActive: req.body.isActive !== 'false',
    });
    return successResponse(res, { statusCode: 201, message: 'CV diunggah', data });
  }),
  update: asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (req.file) {
      body.fileName = req.file.originalname;
      body.fileUrl = `/uploads/cv/${req.file.filename}`;
      body.fileSize = req.file.size;
      body.mimeType = req.file.mimetype;
    }
    if (body.isActive === 'true') body.isActive = true;
    if (body.isActive === 'false') body.isActive = false;
    const data = await cvService.update(req, req.params.id, body);
    return successResponse(res, { message: 'CV diperbarui', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await cvService.remove(req, req.params.id);
    return successResponse(res, { message: 'CV dihapus' });
  }),
  download: asyncHandler(async (req, res) => {
    const data = await cvService.trackDownload(req.params.id);
    return successResponse(res, { data });
  }),
};

/* Settings */
const settingController = {
  list: asyncHandler(async (_req, res) => {
    const data = await settingService.list();
    return successResponse(res, { data });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await settingService.get(req.params.key);
    return successResponse(res, { data });
  }),
  upsert: asyncHandler(async (req, res) => {
    const data = await settingService.upsert(req, req.params.key, req.body.value ?? req.body);
    return successResponse(res, { message: 'Setting disimpan', data });
  }),
};

/* Dashboard */
const dashboardController = {
  overview: asyncHandler(async (_req, res) => {
    const data = await dashboardService.overview();
    return successResponse(res, { data });
  }),
};

/* Upload generic */
const uploadController = {
  image: asyncHandler(async (req, res) => {
    if (!req.file) {
      const { ApiError } = require('../utils/response');
      throw new ApiError(400, 'File diperlukan');
    }
    const folder = req.params.folder || 'images';
    return successResponse(res, {
      message: 'File berhasil diunggah',
      data: {
        filename: req.file.filename,
        url: `/uploads/${folder}/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  }),
};

module.exports = {
  authController,
  aboutController,
  skillController,
  projectController,
  experienceController,
  educationController,
  certificateController,
  socialController,
  cvController,
  settingController,
  dashboardController,
  uploadController,
};
