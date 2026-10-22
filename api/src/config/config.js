const { config } = require('dotenv');
config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const parseTrustProxy = (value) => {
  if (value === undefined) return isProduction ? 1 : false;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const num = Number(value);
  return Number.isNaN(num) ? value : num;
};

const parseNumber = (value, fallback) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
};

const rateLimits = {
  global: {
    windowMs: parseNumber(process.env.RL_GLOBAL_WINDOW_MS, 15 * 60 * 1000),
    limit: parseNumber(process.env.RL_GLOBAL_LIMIT, 10000),
  },
  login: {
    windowMs: parseNumber(process.env.RL_LOGIN_WINDOW_MS, 15 * 60 * 1000),
    limit: parseNumber(process.env.RL_LOGIN_LIMIT, 30),
  },
  register: {
    windowMs: parseNumber(process.env.RL_REGISTER_WINDOW_MS, 60 * 60 * 1000),
    limit: parseNumber(process.env.RL_REGISTER_LIMIT, 60),
  },
  audit: {
    windowMs: parseNumber(process.env.RL_AUDIT_WINDOW_MS, 60 * 1000),
    limit: parseNumber(process.env.RL_AUDIT_LIMIT, 600),
  },
};

module.exports = {
  nodeEnv,
  port: Number(process.env.PORT) || 3000,
  mongoDB: process.env.MONGODB_URI || 'mongodb://localhost:27017/hijos_amados',
  jwtSecret: process.env.JWT_SECRET || 'clave_secreta_para_desarrollo_local_32_caracteres',
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  rateLimits,
  url_web_dev: process.env.FRONTEND_URL || 'http://localhost:5173',
  url_web_preview: process.env.FRONTEND_PREVIEW_URL || 'http://localhost:4173',
  url_web_production: process.env.FRONTEND_PRODUCTION_URL || 'http://localhost:4173',
};