const bcrypt = require('bcryptjs');
const { AdminRepository, SessionRepository, ActivityLogRepository } = require('../repositories');
const { ApiError } = require('../utils/response');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshExpiryDate,
} = require('../utils/jwt');

const adminRepo = new AdminRepository();
const sessionRepo = new SessionRepository();
const activityRepo = new ActivityLogRepository();

class AuthService {
  async login({ email, password, userAgent, ipAddress }) {
    const admin = await adminRepo.findByEmail(email);
    if (!admin) throw new ApiError(401, 'Email atau password salah');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new ApiError(401, 'Email atau password salah');

    const payload = { id: admin.id, email: admin.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await sessionRepo.create({
      adminId: admin.id,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt: getRefreshExpiryDate(),
    });

    await activityRepo.log({
      adminId: admin.id,
      action: 'LOGIN',
      entity: 'auth',
      ipAddress,
      details: { email },
    });

    return {
      accessToken,
      refreshToken,
      admin: { id: admin.id, email: admin.email, name: admin.name, avatar: admin.avatar },
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError(401, 'Refresh token tidak ditemukan');

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, 'Refresh token tidak valid');
    }

    const session = await sessionRepo.findByRefreshToken(refreshToken);
    if (!session || session.expiresAt < new Date()) {
      throw new ApiError(401, 'Sesi tidak valid atau kedaluwarsa');
    }

    const payload = { id: decoded.id, email: decoded.email };
    const accessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    await sessionRepo.deleteByRefreshToken(refreshToken);
    await sessionRepo.create({
      adminId: session.adminId,
      refreshToken: newRefreshToken,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: getRefreshExpiryDate(),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      admin: session.admin,
    };
  }

  async logout(refreshToken, adminId, ipAddress) {
    if (refreshToken) await sessionRepo.deleteByRefreshToken(refreshToken);
    if (adminId) {
      await activityRepo.log({
        adminId,
        action: 'LOGOUT',
        entity: 'auth',
        ipAddress,
      });
    }
    return true;
  }

  async me(adminId) {
    const admin = await adminRepo.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, name: true, avatar: true, createdAt: true },
    });
    if (!admin) throw new ApiError(404, 'Admin tidak ditemukan');
    return admin;
  }

  async changePassword(adminId, { currentPassword, newPassword }) {
    const admin = await adminRepo.findUnique({ where: { id: adminId } });
    if (!admin) throw new ApiError(404, 'Admin tidak ditemukan');

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) throw new ApiError(400, 'Password saat ini salah');

    const hashed = await bcrypt.hash(newPassword, 12);
    await adminRepo.update(adminId, { password: hashed });
    await sessionRepo.deleteByAdminId(adminId);

    await activityRepo.log({
      adminId,
      action: 'CHANGE_PASSWORD',
      entity: 'auth',
    });

    return true;
  }
}

module.exports = new AuthService();
