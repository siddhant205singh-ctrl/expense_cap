import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 15 : 500,
  message: { success: false, error: { message: 'Too many requests from this IP, please try again after 15 minutes' } }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { success: false, error: { message: 'Too many requests from this IP, please try again after 15 minutes' } }
});
