import type { Request, Response } from 'express';
import { Customer, Order, OrderStatusHistory } from '../models/index.js';
import { Op } from 'sequelize';

export class CustomerController {
  static async listCustomers(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const where: any = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { phoneNumber: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const customers = await Customer.findAll({
        where,
        include: [
          {
            model: Order,
            as: 'orders',
            attributes: ['id', 'createdAt'],
            limit: 1,
            order: [['createdAt', 'DESC']]
          }
        ],
        order: [['name', 'ASC']]
      });

      // Transform to include some metrics if needed
      const result = customers.map(c => {
        const lastOrder = (c as any).orders?.[0];
        return {
          id: c.id,
          name: c.name,
          phoneNumber: c.phoneNumber,
          email: c.email,
          lastActive: lastOrder ? lastOrder.createdAt : c.createdAt,
          totalOrders: (c as any).orders?.length || 0 // This is not accurate without count, but for MVP it might be ok if we fetch All.
          // Better to use Sequelize count or separate query for large datasets.
        };
      });

      // Get counts for all customers
      const counts = await Order.findAll({
        attributes: ['customerId', [Order.sequelize!.fn('COUNT', 'id'), 'count']],
        group: ['customerId']
      });
      const countMap = counts.reduce((acc: any, curr: any) => {
        acc[curr.customerId] = parseInt(curr.get('count') as string);
        return acc;
      }, {});

      res.json(result.map(r => ({ ...r, totalOrders: countMap[r.id] || 0 })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCustomerDetail(req: Request, res: Response) {
    try {
      const customer = await Customer.findByPk(req.params['id'] as string, {
        include: [
          {
            model: Order,
            as: 'orders',
            include: [
              {
                model: OrderStatusHistory,
                as: 'statusHistory',
                limit: 1,
                order: [['timestamp', 'DESC']]
              }
            ],
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const { name, phoneNumber, email } = req.body;
      const customer = await Customer.findByPk(req.params['id'] as string);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      await customer.update({ name, phoneNumber, email });
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
