import eventEmitter, { EVENTS } from './eventEmitter.js';
import { WhatsAppService } from '../whatsapp/whatsappService.js';
import { Order, Customer, OrderStatusHistory } from '../models/index.js';

type OrderWithCustomer = Order & {
  customer: Customer;
  statusHistory?: OrderStatusHistory[];
};

export function setupEventListeners() {
  eventEmitter.on(EVENTS.ORDER_CREATED, async (order: OrderWithCustomer) => {
    console.log(`Event: OrderCreated - ${order.orderNumber}`);
    await WhatsAppService.sendOrderConfirmation(
      order.customer.phoneNumber,
      order.customer.name,
      order.orderNumber,
      order.id
    );
  });

  eventEmitter.on(EVENTS.STATUS_CHANGED, async (order: OrderWithCustomer) => {
    console.log(`Event: StatusChanged - ${order.orderNumber} to ${order.statusHistory?.[0]?.status || 'UNKNOWN'}`);

    await WhatsAppService.sendStatusUpdate(
      order.customer.phoneNumber,
      order.customer.name,
      order.orderNumber,
      order.statusHistory?.[0]?.status || 'Updated',
      order.id
    );
  });

  eventEmitter.on(EVENTS.INVOICE_GENERATED, async ({ orderId, pdfUrl }: { orderId: string, pdfUrl: string }) => {
    console.log(`Event: InvoiceGenerated - ${orderId}`);

    // Fetch full order for invoice notification
    const order = await Order.findByPk(orderId, {
      include: [{ model: Customer, as: 'customer' }]
    }) as OrderWithCustomer | null;

    if (order) {
      await WhatsAppService.sendInvoiceNotification(
        order.customer.phoneNumber,
        order.customer.name,
        order.orderNumber,
        pdfUrl,
        order.id
      );
    }
  });

  eventEmitter.on(EVENTS.PAYMENT_RECEIVED, (payment) => {
    console.log(`Event: PaymentReceived - ${payment.amount} for order ${payment.orderId}`);
  });
}
