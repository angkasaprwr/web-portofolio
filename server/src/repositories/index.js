const BaseRepository = require('./BaseRepository');
const prisma = require('../config/database');

class AdminRepository extends BaseRepository {
  constructor() {
    super('admin');
  }

  findByEmail(email) {
    return this.findUnique({ where: { email } });
  }
}

class AboutRepository extends BaseRepository {
  constructor() {
    super('about');
  }

  getActive() {
    return this.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } });
  }
}

class SkillRepository extends BaseRepository {
  constructor() {
    super('skill');
  }
}

class ProjectRepository extends BaseRepository {
  constructor() {
    super('project');
  }

  findBySlug(slug) {
    return this.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  }

  findWithImages(id) {
    return this.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  }
}

class ExperienceRepository extends BaseRepository {
  constructor() {
    super('experience');
  }

  findWithImages(id) {
    return this.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  }
}

 cursor/portfolio-website-980a
class EducationRepository extends BaseRepository {
  constructor() {
    super('education');
  }
}


 main
class CertificateRepository extends BaseRepository {
  constructor() {
    super('certificate');
  }
}

class SocialLinkRepository extends BaseRepository {
  constructor() {
    super('socialLink');
  }
}

class CvFileRepository extends BaseRepository {
  constructor() {
    super('cvFile');
  }

  getActive() {
    return this.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  }
}

class SettingRepository extends BaseRepository {
  constructor() {
    super('setting');
  }

  findByKey(key) {
    return this.findUnique({ where: { key } });
  }
}

class ActivityLogRepository extends BaseRepository {
  constructor() {
    super('activityLog');
  }

  async log({ adminId, action, entity, entityId, details, ipAddress }) {
    return this.create({ adminId, action, entity, entityId, details, ipAddress });
  }
}

class SessionRepository extends BaseRepository {
  constructor() {
    super('session');
  }

  findByRefreshToken(refreshToken) {
    return this.findUnique({
      where: { refreshToken },
      include: { admin: { select: { id: true, email: true, name: true, avatar: true } } },
    });
  }

  deleteByRefreshToken(refreshToken) {
    return prisma.session.deleteMany({ where: { refreshToken } });
  }

  deleteByAdminId(adminId) {
    return prisma.session.deleteMany({ where: { adminId } });
  }
}

module.exports = {
  AdminRepository,
  AboutRepository,
  SkillRepository,
  ProjectRepository,
  ExperienceRepository,
 cursor/portfolio-website-980a
  EducationRepository,

 main
  CertificateRepository,
  SocialLinkRepository,
  CvFileRepository,
  SettingRepository,
  ActivityLogRepository,
  SessionRepository,
};
