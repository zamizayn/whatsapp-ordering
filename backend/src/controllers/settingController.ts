import type { Request, Response } from 'express';
import { Setting } from '../models/Setting.js';

export class SettingController {
  static async getSettings(req: Request, res: Response) {
    try {
      const settings = await Setting.findAll();
      const settingsMap = settings.reduce((acc: any, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const updates = req.body; // Expecting { KEY: VALUE }
      for (const [key, value] of Object.entries(updates)) {
        await Setting.upsert({ key, value: String(value) });
      }
      res.json({ message: 'Settings updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
