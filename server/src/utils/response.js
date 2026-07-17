class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const successResponse = (res, { statusCode = 200, message = 'Success', data = null, meta = null }) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const paginate = ({ page = 1, limit = 10, total }) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const totalPages = Math.ceil(total / perPage) || 1;
  return {
    page: currentPage,
    limit: perPage,
    total,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    skip: (currentPage - 1) * perPage,
  };
};

module.exports = { ApiError, asyncHandler, successResponse, paginate };
