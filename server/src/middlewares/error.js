const { ApiError } = require('../utils/response');

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`));
};

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Data sudah ada (duplikat)';
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Data tidak ditemukan';
  }
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
