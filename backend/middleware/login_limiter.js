import rateLimit from 'express-rate-limit';

// Create a rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
