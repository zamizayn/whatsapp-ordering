import type { Request, Response } from 'express';
import { Customer, Order, OrderStatusHistory } from '../models/index.js';
import twilio from 'twilio';

export class WhatsAppWebhookController {
  static async handleIncoming(req: Request, res: Response) {
    const { From, Body } = req.body;
    const phoneNumber = From.replace('whatsapp:', '');
    const message = Body.trim();

    console.log(`Incoming WhatsApp from ${phoneNumber}: ${message}`);

    const messagingResponse = new twilio.twiml.MessagingResponse();

    if (message.toUpperCase().startsWith('STATUS')) {
      const parts = message.split(' ');
      const orderNumber = parts[1];

      if (!orderNumber) {
        messagingResponse.message('Please provide an order number. Example: STATUS 102');
      } else {
        const order = await Order.findOne({
          where: { orderNumber },
          include: [
            { model: Customer, as: 'customer' },
            { model: OrderStatusHistory, as: 'statusHistory', order: [['timestamp', 'DESC']], limit: 1 }
          ],
        }) as any;

        if (!order) {
          messagingResponse.message(`Order #${orderNumber} not found.`);
        } else if (order.customer.phoneNumber !== phoneNumber) {
          messagingResponse.message('Access denied. Phone number does not match order record.');
        } else {
          const status = order.statusHistory?.[0]?.status || 'CREATED';
          const deliveryDate = new Date(order.expectedDeliveryDate).toDateString();
          messagingResponse.message(`Order #${orderNumber}\nStatus: ${status}\nExpected delivery: ${deliveryDate}`);
        }
      }
    } else {
      messagingResponse.message('Welcome! Send "STATUS <order_number>" to track your order.');
    }

    res.type('text/xml').send(messagingResponse.toString());
  }
}
