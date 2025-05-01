// JWT verification middleware
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided'});
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

       } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Session expired' });
        }
        if (err instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ code: 'INVALID_TOKEN', message: 'Corrupted token' });
        }
        // Log unexpected errors
        console.error('JWT Verification Error:', err);
        return res.status(500).json({ code: 'AUTH_ERROR', message: 'Authentication failure' });
      }
};

