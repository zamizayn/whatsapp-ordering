import type { Request, Response } from 'express';
import { OrderService } from '../services/orderService.js';
import { InvoiceService } from '../invoices/invoiceService.js';

export class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const orders = await OrderService.listOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDetail(req: Request, res: Response) {
    try {
      const order = await OrderService.getOrderTimeline(req.params['id'] as string);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { status, actor } = req.body;
      const order = await OrderService.updateStatus(req.params['id'] as string, status, actor);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async generateInvoice(req: Request, res: Response) {
    try {
      const invoice = await InvoiceService.generateInvoice(req.params['id'] as string);
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
