import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {}

const eventEmitter = new AppEventEmitter();

export const EVENTS = {
  ORDER_CREATED: 'OrderCreated',
  STATUS_CHANGED: 'StatusChanged',
  INVOICE_GENERATED: 'InvoiceGenerated',
  PAYMENT_RECEIVED: 'PaymentReceived',
  MESSAGE_QUEUED: 'MessageQueued',
  MESSAGE_SENT: 'MessageSent',
  MESSAGE_FAILED: 'MessageFailed',
};

export default eventEmitter;
