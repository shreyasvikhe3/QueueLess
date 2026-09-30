import jwt from 'jsonwebtoken';
import { store } from '../models/store.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication required. Please log in.' }
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'queueless_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    
    const user = store.users.find(u => u.userId === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token. User no longer exists.' }
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: { message: 'Invalid or expired token.' }
    });
  }
}
