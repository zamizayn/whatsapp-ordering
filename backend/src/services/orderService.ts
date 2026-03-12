import { Customer, Order, OrderStatusHistory, Payment, Invoice, MessageLog, OrderItem } from '../models/index.js';
import eventEmitter, { EVENTS } from '../events/eventEmitter.js';
import { OrderStatus } from '../models/Order.js';

export class OrderService {
  static async createOrder(data: {
    customerName: string;
    phoneNumber: string;
    email?: string;
    description: string;
    totalAmount: number;
    advanceAmount?: number;
    expectedDeliveryDate: Date;
    items?: Array<{ productName: string; quantity: number; unitPrice: number }>;
  }) {
    // Find or create customer
    let [customer] = await Customer.findOrCreate({
      where: { phoneNumber: data.phoneNumber },
      defaults: {
        name: data.customerName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      }
    });

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderNumber,
      customerId: customer.id,
      description: data.description,
      totalAmount: data.totalAmount,
      advanceAmount: data.advanceAmount || 0,
      expectedDeliveryDate: data.expectedDeliveryDate,
    });

    // Create order items if provided
    if (data.items && data.items.length > 0) {
      await Promise.all(data.items.map(item => 
        OrderItem.create({
          orderId: order.id,
          ...item
        })
      ));
    }

    await OrderStatusHistory.create({
      orderId: order.id,
      status: OrderStatus.CREATED,
      actor: 'SYSTEM',
    });

    const orderWithCustomer = await Order.findByPk(order.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: OrderItem, as: 'items' }
      ]
    });

    eventEmitter.emit(EVENTS.ORDER_CREATED, orderWithCustomer);

    if (data.advanceAmount && data.advanceAmount > 0) {
      await this.recordPayment(order.id, data.advanceAmount, 'ADVANCE', 'CASH');
    }

    return orderWithCustomer;
  }

  static async updateStatus(orderId: string, status: OrderStatus, actor: string) {
    await OrderStatusHistory.create({
      orderId,
      status,
      actor,
    });

    const order = await Order.findByPk(orderId, {
      include: [
        { model: Customer, as: 'customer' },
        { model: OrderStatusHistory, as: 'statusHistory', limit: 1, order: [['timestamp', 'DESC']] }
      ]
    });

    eventEmitter.emit(EVENTS.STATUS_CHANGED, order);
    return order;
  }

  static async recordPayment(orderId: string, amount: number, type: 'ADVANCE' | 'BALANCE', method: string) {
    const payment = await Payment.create({
      orderId,
      amount,
      paymentType: type,
      method,
    });

    eventEmitter.emit(EVENTS.PAYMENT_RECEIVED, payment);

    if (type === 'ADVANCE') {
      await this.updateStatus(orderId, OrderStatus.ADVANCE_RECEIVED, 'SYSTEM');
    }

    return payment;
  }

  static async getOrderTimeline(orderId: string) {
    return Order.findByPk(orderId, {
      include: [
        { model: Customer, as: 'customer' },
        { model: OrderItem, as: 'items' },
        { model: OrderStatusHistory, as: 'statusHistory', order: [['timestamp', 'DESC']] },
        { model: Payment, as: 'payments', order: [['timestamp', 'DESC']] },
        { model: Invoice, as: 'invoices', order: [['generatedAt', 'DESC']] },
        { model: MessageLog, as: 'messageLogs', order: [['timestamp', 'DESC']] },
      ],
    });
  }

  static async listOrders() {
    return Order.findAll({
      include: [
        { model: Customer, as: 'customer' },
        { model: OrderStatusHistory, as: 'statusHistory', order: [['timestamp', 'DESC']], limit: 1 },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
