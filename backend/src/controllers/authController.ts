import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tracker-pro-secret-key-123';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '24h',
      });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async setupFirstAdmin(req: Request, res: Response) {
    try {
      const userCount = await User.count();
      if (userCount > 0) {
        return res.status(400).json({ error: 'Initial setup already completed' });
      }

      const { name, username, password } = req.body;
      const admin = await User.create({
        name,
        username,
        passwordHash: password, // Will be hashed by hook
        role: UserRole.ADMIN,
      });

      res.json({ message: 'Admin user created successfully', user: { id: admin.id, username: admin.username } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProfile(req: any, res: Response) {
    res.json(req.user);
  }
}
