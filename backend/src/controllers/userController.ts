import type { Request, Response } from 'express';
import { User } from '../models/index.js';

export class UserController {
  static async list(req: Request, res: Response) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['passwordHash'] },
        order: [['name', 'ASC']]
      });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, username, password, role } = req.body;
      const user = await User.create({
        name,
        username,
        passwordHash: password,
        role,
      });
      
      const { passwordHash: _, ...result } = user.toJSON();
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { name, role, password } = req.body;
      const user = await User.findByPk(req.params['id'] as string);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updates: any = { name, role };
      if (password) updates.passwordHash = password;

      await user.update(updates);
      const { passwordHash: _, ...result } = user.toJSON();
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.params['id'] as string);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
