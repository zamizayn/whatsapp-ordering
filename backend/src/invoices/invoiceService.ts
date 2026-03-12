import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Order, Customer, Invoice } from '../models/index.js';
import eventEmitter, { EVENTS } from '../events/eventEmitter.js';

export class InvoiceService {
  static async generateInvoice(orderId: string) {
    const order = await Order.findByPk(orderId, {
      include: [{ model: Customer, as: 'customer' }],
    }) as any;

    if (!order) throw new Error('Order not found');

    const invoiceNumber = `INV-${Date.now()}`;
    const filename = `${invoiceNumber}.pdf`;
    const invoicesDir = path.join(process.cwd(), 'storage/invoices');
    
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(invoicesDir, filename);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
    doc.text(`Order Number: ${order.orderNumber}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text(`Customer Name: ${order.customer.name}`);
    doc.text(`Phone: ${order.customer.phoneNumber}`);
    doc.moveDown();
    doc.text('Description:', { underline: true });
    doc.text(order.description);
    doc.moveDown();

    const total = Number(order.totalAmount);
    const advance = Number(order.advanceAmount);
    const balance = total - advance;

    doc.text(`Total Amount: $${total.toFixed(2)}`);
    doc.text(`Advance Paid: $${advance.toFixed(2)}`);
    doc.text(`Balance Due: $${balance.toFixed(2)}`, { oblique: true });
    doc.end();

    const pdfUrl = `/invoices/${filename}`;
    
    const invoice = await Invoice.create({
      orderId,
      invoiceNumber,
      pdfUrl,
    });

    eventEmitter.emit(EVENTS.INVOICE_GENERATED, { orderId, invoiceId: invoice.id, pdfUrl });

    return invoice;
  }
}
