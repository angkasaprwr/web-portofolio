const jwt = require('jsonwebtoken');
const config = require('../config');

const signAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });

const signRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });

const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);

const verifyRefreshToken = (token) => jwt.verify(token, config.jwt.refreshSecret);

const getRefreshExpiryDate = () => {
  const match = String(config.jwt.refreshExpiresIn).match(/^(\d+)([dhms])$/);
  const now = Date.now();
  if (!match) return new Date(now + 7 * 24 * 60 * 60 * 1000);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return new Date(now + value * multipliers[unit]);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiryDate,
};
