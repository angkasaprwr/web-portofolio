const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/response');

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        422,
        'Validasi gagal',
        errors.array().map((e) => ({ field: e.path, message: e.msg }))
      )
    );
  }
  next();
};

module.exports = validate;
