const {
  AboutRepository,
  SkillRepository,
  ProjectRepository,
  ExperienceRepository,
  EducationRepository,

  CertificateRepository,
  SocialLinkRepository,
  CvFileRepository,
  SettingRepository,
  ActivityLogRepository,
} = require('../repositories');
const { ApiError, paginate } = require('../utils/response');
const { slugify } = require('../utils/helpers');
const prisma = require('../config/database');

const aboutRepo = new AboutRepository();
const skillRepo = new SkillRepository();
const projectRepo = new ProjectRepository();
const experienceRepo = new ExperienceRepository();
const educationRepo = new EducationRepository();

const certificateRepo = new CertificateRepository();
const socialRepo = new SocialLinkRepository();
const cvRepo = new CvFileRepository();
const settingRepo = new SettingRepository();
const activityRepo = new ActivityLogRepository();

const logActivity = (req, action, entity, entityId, details) =>
  activityRepo.log({
    adminId: req.admin?.id,
    action,
    entity,
    entityId,
    details,
    ipAddress: req.ip,
  });

/* ───────────── About ───────────── */
const aboutService = {
  async get() {
    const about = await aboutRepo.getActive();
    if (!about) throw new ApiError(404, 'Data tentang saya belum tersedia');
    return about;
  },
  async upsert(req, data) {
    const existing = await aboutRepo.getActive();
    let result;
    if (existing) {
      result = await aboutRepo.update(existing.id, data);
      await logActivity(req, 'UPDATE', 'about', result.id, { fields: Object.keys(data) });
    } else {
      result = await aboutRepo.create(data);
      await logActivity(req, 'CREATE', 'about', result.id);
    }
    return result;
  },
  async update(req, id, data) {
    const result = await aboutRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'about', id, { fields: Object.keys(data) });
    return result;
  },
};

/* ───────────── Skills ───────────── */
const skillService = {
  async list({ page, limit, search, category, featured, all }) {
    const where = {};
    if (all !== 'true' && all !== true) where.isActive = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;

    const total = await skillRepo.count(where);
    const takeAll = all === 'true' || all === true;
    const meta = paginate({ page, limit: takeAll ? total || 100 : limit, total });
    const data = await skillRepo.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      skip: takeAll ? 0 : meta.skip,
      take: takeAll ? undefined : meta.limit,
    });
    return { data, meta };
  },
  async getById(id) {
    const skill = await skillRepo.findUnique({ where: { id } });
    if (!skill) throw new ApiError(404, 'Skill tidak ditemukan');
    return skill;
  },
  async create(req, data) {
    const result = await skillRepo.create(data);
    await logActivity(req, 'CREATE', 'skill', result.id, { name: result.name });
    return result;
  },
  async update(req, id, data) {
    const result = await skillRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'skill', id);
    return result;
  },
  async remove(req, id) {
    await skillRepo.delete(id);
    await logActivity(req, 'DELETE', 'skill', id);
    return true;
  },
  async categories() {
    const skills = await skillRepo.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });
    return skills.map((s) => s.category);
  },
  async reorder(req, orders) {
    if (!Array.isArray(orders) || orders.length === 0) {
      throw new ApiError(400, 'Data urutan tidak valid');
    }
    await prisma.$transaction(
      orders.map(({ id, order }) =>
        skillRepo.update(id, { order: Number(order) || 0 })
      )
    );
    await logActivity(req, 'UPDATE', 'skill', 'reorder', { count: orders.length });
    return true;
  },

};

/* ───────────── Projects ───────────── */
const projectService = {
  async list({ page, limit, search, category, featured, status, sort = 'newest', all }) {
    const where = {};
    if (all !== 'true' && all !== true) where.isActive = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category && category !== 'Semua') where.category = category;
    if (featured === 'true') where.featured = true;
    if (status) where.status = status;

    const orderBy =
      sort === 'oldest'
        ? { createdAt: 'asc' }
        : sort === 'title'
          ? { title: 'asc' }
          : sort === 'order'
            ? { order: 'asc' }
            : { createdAt: 'desc' };

    const total = await projectRepo.count(where);
    const takeAll = all === 'true' || all === true;
    const meta = paginate({ page, limit: takeAll ? total || 50 : limit, total });
    const data = await projectRepo.findMany({
      where,
      include: { images: { orderBy: { order: 'asc' }, take: 1 } },
      orderBy: [orderBy, { order: 'asc' }],
      skip: takeAll ? 0 : meta.skip,
      take: takeAll ? undefined : meta.limit,
    });
    return { data, meta };
  },
  async getById(id) {
    const project = await projectRepo.findWithImages(id);
    if (!project) throw new ApiError(404, 'Project tidak ditemukan');
    return project;
  },
  async getBySlug(slug) {
    const project = await projectRepo.findBySlug(slug);
    if (!project || !project.isActive) throw new ApiError(404, 'Project tidak ditemukan');
    await prisma.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    });
    return project;
  },
  async create(req, data) {
    if (!data.slug) data.slug = slugify(data.title);
    const existing = await projectRepo.findUnique({ where: { slug: data.slug } });
    if (existing) data.slug = `${data.slug}-${Date.now()}`;
    const result = await projectRepo.create(data);
    await logActivity(req, 'CREATE', 'project', result.id, { title: result.title });
    return result;
  },
  async update(req, id, data) {
    if (data.title && !data.slug) data.slug = slugify(data.title);
    const result = await projectRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'project', id);
    return projectRepo.findWithImages(result.id);
  },
  async remove(req, id) {
    await projectRepo.delete(id);
    await logActivity(req, 'DELETE', 'project', id);
    return true;
  },
  async addImage(req, projectId, url, caption) {
    const image = await prisma.projectImage.create({
      data: { projectId, url, caption },
    });
    await logActivity(req, 'CREATE', 'project_image', image.id);
    return image;
  },
  async removeImage(req, imageId) {
    await prisma.projectImage.delete({ where: { id: imageId } });
    await logActivity(req, 'DELETE', 'project_image', imageId);
    return true;
  },
  async categoryStats() {
    const categories = ['UI Design', 'Website', 'Data Analysis', 'Lainnya'];
    const stats = await Promise.all(
      categories.map(async (category) => {
        const count = await projectRepo.count({ category, isActive: true });
        return { category, count };
      })
    );
    return stats;
  },
};

/* ───────────── Experiences ───────────── */
const experienceService = {
  async list({ page, limit, search, type, category, sort = 'newest', all }) {
    const where = {};
    if (all !== 'true' && all !== true) where.isActive = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (category && category !== 'Semua') where.category = category;

    const orderBy =
      sort === 'oldest' ? { startDate: 'asc' } : sort === 'order' ? { order: 'asc' } : { startDate: 'desc' };

    const total = await experienceRepo.count(where);
    const takeAll = all === 'true' || all === true;
    const meta = paginate({ page, limit: takeAll ? total || 50 : limit, total });
    const data = await experienceRepo.findMany({
      where,
      include: { images: { orderBy: { order: 'asc' }, take: 1 } },
      orderBy: [orderBy, { order: 'asc' }],
      skip: takeAll ? 0 : meta.skip,
      take: takeAll ? undefined : meta.limit,
    });
    return { data, meta };
  },
  async getById(id) {
    const item = await experienceRepo.findWithImages(id);
    if (!item) throw new ApiError(404, 'Pengalaman tidak ditemukan');
    return item;
  },
  async create(req, data) {
    const result = await experienceRepo.create(data);
    await logActivity(req, 'CREATE', 'experience', result.id, { title: result.title });
    return result;
  },
  async update(req, id, data) {
    const result = await experienceRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'experience', id);
    return experienceRepo.findWithImages(result.id);
  },
  async remove(req, id) {
    await experienceRepo.delete(id);
    await logActivity(req, 'DELETE', 'experience', id);
    return true;
  },
  async addImage(req, experienceId, url, caption) {
    const image = await prisma.experienceImage.create({
      data: { experienceId, url, caption },
    });
    await logActivity(req, 'CREATE', 'experience_image', image.id);
    return image;
  },
  async removeImage(req, imageId) {
    await prisma.experienceImage.delete({ where: { id: imageId } });
    await logActivity(req, 'DELETE', 'experience_image', imageId);
    return true;
  },
  async categoryStats() {
    const categories = ['Magang', 'Jobdesk', 'Organisasi', 'Proyek Kelompok', 'Sertifikat & Kursus'];
    const stats = await Promise.all(
      categories.map(async (category) => {
        const count = await experienceRepo.count({ category, isActive: true });
        const type = ['Magang', 'Jobdesk'].includes(category) ? 'Formal' : 'Informal';
        return { category, type, count };
      })
    );
    return stats;
  },
};

/* ───────────── Education ───────────── */
const educationService = {
  async list({ all } = {}) {
    const where = all === 'true' || all === true ? {} : { isActive: true };
    return educationRepo.findMany({ where, orderBy: { order: 'asc' } });
  },
  async getById(id) {
    const item = await educationRepo.findUnique({ where: { id } });
    if (!item) throw new ApiError(404, 'Pendidikan tidak ditemukan');
    return item;
  },
  async create(req, data) {
    const result = await educationRepo.create(data);
    await logActivity(req, 'CREATE', 'education', result.id, { institution: result.institution });
    return result;
  },
  async update(req, id, data) {
    const result = await educationRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'education', id);
    return result;
  },
  async remove(req, id) {
    await educationRepo.delete(id);
    await logActivity(req, 'DELETE', 'education', id);
    return true;
  },
};


/* ───────────── Certificates ───────────── */
const certificateService = {
  async list({ page, limit, search, all }) {
    const where = {};
    if (!all) where.isActive = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { issuer: { contains: search, mode: 'insensitive' } },
      ];
    }
    const total = await certificateRepo.count(where);
    const meta = paginate({ page, limit: all ? total || 50 : limit, total });
    const data = await certificateRepo.findMany({
      where,
      orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
      skip: all ? 0 : meta.skip,
      take: all ? undefined : meta.limit,
    });
    return { data, meta };
  },
  async getById(id) {
    const item = await certificateRepo.findUnique({ where: { id } });
    if (!item) throw new ApiError(404, 'Sertifikat tidak ditemukan');
    return item;
  },
  async create(req, data) {
    const result = await certificateRepo.create(data);
    await logActivity(req, 'CREATE', 'certificate', result.id);
    return result;
  },
  async update(req, id, data) {
    const result = await certificateRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'certificate', id);
    return result;
  },
  async remove(req, id) {
    await certificateRepo.delete(id);
    await logActivity(req, 'DELETE', 'certificate', id);
    return true;
  },
};

/* ───────────── Social Links ───────────── */
const socialService = {
  async list({ all } = {}) {
    const where = all ? {} : { isActive: true };
    return socialRepo.findMany({ where, orderBy: { order: 'asc' } });
  },
  async getById(id) {
    const item = await socialRepo.findUnique({ where: { id } });
    if (!item) throw new ApiError(404, 'Social link tidak ditemukan');
    return item;
  },
  async create(req, data) {
    const result = await socialRepo.create(data);
    await logActivity(req, 'CREATE', 'social_link', result.id);
    return result;
  },
  async update(req, id, data) {
    const result = await socialRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'social_link', id);
    return result;
  },
  async remove(req, id) {
    await socialRepo.delete(id);
    await logActivity(req, 'DELETE', 'social_link', id);
    return true;
  },
};

/* ───────────── CV ───────────── */
const cvService = {
  async list({ all } = {}) {
    const where = all ? {} : { isActive: true };
    return cvRepo.findMany({ where, orderBy: { createdAt: 'desc' } });
  },
  async getActive() {
    const cv = await cvRepo.getActive();
    if (!cv) throw new ApiError(404, 'CV belum tersedia');
    return cv;
  },
  async create(req, data) {
    if (data.isActive) {
      await prisma.cvFile.updateMany({ data: { isActive: false } });
    }
    const result = await cvRepo.create(data);
    await logActivity(req, 'CREATE', 'cv', result.id);
    return result;
  },
  async update(req, id, data) {
    if (data.isActive) {
      await prisma.cvFile.updateMany({ data: { isActive: false } });
    }
    const result = await cvRepo.update(id, data);
    await logActivity(req, 'UPDATE', 'cv', id);
    return result;
  },
  async remove(req, id) {
    await cvRepo.delete(id);
    await logActivity(req, 'DELETE', 'cv', id);
    return true;
  },
  async trackDownload(id) {
    return prisma.cvFile.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  },
};

/* ───────────── Settings ───────────── */
const settingService = {
  async list() {
    const settings = await settingRepo.findMany();
    return settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
  },
  async get(key) {
    const setting = await settingRepo.findByKey(key);
    if (!setting) throw new ApiError(404, 'Setting tidak ditemukan');
    return setting;
  },
  async upsert(req, key, value) {
    const result = await settingRepo.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    await logActivity(req, 'UPDATE', 'setting', result.id, { key });
    return result;
  },
};

/* ───────────── Dashboard ───────────── */
const dashboardService = {
  async overview() {
    const [
      projectsCount,
      skillsCount,
      experiencesCount,
      certificatesCount,
      recentProjects,
      recentActivities,
      projectsByCategory,
      experiencesByType,
    ] = await Promise.all([
      prisma.project.count({ where: { isActive: true } }),
      prisma.skill.count({ where: { isActive: true } }),
      prisma.experience.count({ where: { isActive: true } }),
      prisma.certificate.count({ where: { isActive: true } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, category: true, createdAt: true, thumbnail: true },
      }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { name: true, email: true } } },
      }),
      prisma.project.groupBy({
        by: ['category'],
        _count: { category: true },
        where: { isActive: true },
      }),
      prisma.experience.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { isActive: true },
      }),
    ]);

    return {
      stats: {
        projects: projectsCount,
        skills: skillsCount,
        experiences: experiencesCount,
        certificates: certificatesCount,
      },
      recentProjects,
      recentActivities,
      charts: {
        projectsByCategory: projectsByCategory.map((p) => ({
          category: p.category,
          count: p._count.category,
        })),
        experiencesByType: experiencesByType.map((e) => ({
          type: e.type,
          count: e._count.type,
        })),
      },
    };
  },
};

module.exports = {
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
};
