import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../models/store.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, phone, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Name, email, and password are required fields.' }
        });
      }

      const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: { message: 'An account with this email already exists.' }
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userRole = ['ADMIN', 'STAFF', 'USER'].includes(role) ? role : 'USER';
      const userId = `usr-${Date.now()}`;

      const newUser = {
        userId,
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || '',
        role: userRole,
        fcmToken: null,
        createdAt: new Date().toISOString()
      };

      store.users.push(newUser);

      const secret = process.env.JWT_SECRET || 'queueless_super_secret_jwt_key_2026';
      const token = jwt.sign(
        { userId: newUser.userId, role: newUser.role, email: newUser.email },
        secret,
        { expiresIn: '7d' }
      );

      const { passwordHash: _, ...safeUser } = newUser;

      res.status(201).json({
        success: true,
        data: {
          token,
          user: safeUser
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email and password are required.' }
        });
      }

      const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid credentials. User not found.' }
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid credentials. Incorrect password.' }
        });
      }

      const secret = process.env.JWT_SECRET || 'queueless_super_secret_jwt_key_2026';
      const token = jwt.sign(
        { userId: user.userId, role: user.role, email: user.email },
        secret,
        { expiresIn: '7d' }
      );

      const { passwordHash: _, ...safeUser } = user;

      res.json({
        success: true,
        data: {
          token,
          user: safeUser
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const { passwordHash, ...safeUser } = req.user;
      res.json({
        success: true,
        data: safeUser
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateFcmToken(req, res, next) {
    try {
      const { fcmToken } = req.body;
      req.user.fcmToken = fcmToken;
      res.json({
        success: true,
        message: 'FCM Token updated successfully.'
      });
    } catch (err) {
      next(err);
    }
  }
}
