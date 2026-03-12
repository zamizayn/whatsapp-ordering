import type { Request, Response } from 'express';
import { Product } from '../models/index.js';

export class ProductController {
  static async list(req: Request, res: Response) {
    try {
      const products = await Product.findAll({ order: [['name', 'ASC']] });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [updated] = await Product.update(req.body, { where: { id: id as string } });
      if (updated) {
        const product = await Product.findByPk(id as string);
        return res.json(product);
      }
      res.status(404).json({ error: 'Product not found' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Product.destroy({ where: { id } });
      if (deleted) {
        return res.status(204).send();
      }
      res.status(404).json({ error: 'Product not found' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
