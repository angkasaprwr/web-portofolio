const { verifyAccessToken } = require('../utils/jwt');
const { ApiError } = require('../utils/response');
const prisma = require('../config/database');

const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Token tidak ditemukan');

    const decoded = verifyAccessToken(token);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, avatar: true },
    });
    if (!admin) throw new ApiError(401, 'Admin tidak ditemukan');

    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(new ApiError(401, 'Token kedaluwarsa'));
    if (err.name === 'JsonWebTokenError') return next(new ApiError(401, 'Token tidak valid'));
    next(err);
  }
};

module.exports = { authenticate };
