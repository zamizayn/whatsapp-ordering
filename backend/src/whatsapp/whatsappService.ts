import twilio from 'twilio';
import { MessageLog, Setting } from '../models/index.js';
import eventEmitter, { EVENTS } from '../events/eventEmitter.js';

let twilioClient: any = null;
let lastConfig: any = null;

export class WhatsAppService {
  private static async getConfig() {
    const settings = await Setting.findAll();
    const dbConfig = settings.reduce((acc: any, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return {
      accountSid: dbConfig.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID,
      authToken: dbConfig.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN,
      whatsappNumber: dbConfig.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      contentSid: dbConfig.TWILIO_CONTENT_SID || process.env.TWILIO_CONTENT_SID || 'HX48ef372fa7c07005d51d6eb6d1e4ecd5'
    };
  }

  private static async getClient() {
    const config = await this.getConfig();
    
    // Cache client if config hasn't changed
    if (twilioClient && lastConfig && 
        lastConfig.accountSid === config.accountSid && 
        lastConfig.authToken === config.authToken) {
      return { client: twilioClient, from: config.whatsappNumber, contentSid: config.contentSid };
    }

    if (!config.accountSid || !config.authToken) {
      throw new Error('Twilio credentials not configured');
    }

    twilioClient = twilio(config.accountSid, config.authToken);
    lastConfig = config;
    
    let from = config.whatsappNumber;
    if (from === 'whatsapp:+4155238886' || from === '+4155238886') {
      from = 'whatsapp:+14155238886';
    } else if (!from.startsWith('whatsapp:')) {
      from = `whatsapp:${from.startsWith('+') ? from : '+' + from}`;
    }

    return { client: twilioClient, from, contentSid: config.contentSid };
  }

  static async sendTemplateMessage(to: string, variables: Record<string, string>, orderId?: string) {
    try {
      const { client, from, contentSid } = await this.getClient();
      
      let formattedTo = to.trim();
      if (!formattedTo.startsWith('+')) {
        formattedTo = `+${formattedTo}`;
      }
      const toAddress = formattedTo.startsWith('whatsapp:') ? formattedTo : `whatsapp:${formattedTo}`;
      
      console.log(`[WhatsAppService] Sending: From=${from}, To=${toAddress}, ContentSid=${contentSid}`);

      const messageOptions: any = {
        from,
        to: toAddress,
        contentSid: contentSid,
        contentVariables: JSON.stringify(variables)
      };

      const twilioPromise = client.messages.create(messageOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Twilio timeout')), 15000)
      );

      const message = await Promise.race([twilioPromise, timeoutPromise]) as any;

      await MessageLog.create({
        direction: 'OUTBOUND',
        channel: 'whatsapp',
        templateId: contentSid,
        status: 'SENT',
        relatedOrderId: orderId,
      });

      eventEmitter.emit(EVENTS.MESSAGE_SENT, { messageSid: message.sid, orderId });
    } catch (error: any) {
      console.error('[WhatsAppService] Error:', error.message);
      
      await MessageLog.create({
        direction: 'OUTBOUND',
        channel: 'whatsapp',
        templateId: 'ERROR',
        status: 'FAILED',
        relatedOrderId: orderId,
      });

      eventEmitter.emit(EVENTS.MESSAGE_FAILED, { error, orderId });
    }
  }

  static async sendStatusUpdate(to: string, name: string, orderNumber: string, status: string, orderId: string) {
    await this.sendTemplateMessage(to, { '1': name, '2': orderNumber, '3': status }, orderId);
  }

  static async sendOrderConfirmation(to: string, name: string, orderNumber: string, orderId: string) {
    await this.sendTemplateMessage(to, { '1': name, '2': orderNumber, '3': 'CREATED' }, orderId);
  }

  static async sendInvoiceNotification(to: string, name: string, orderNumber: string, invoiceUrl: string, orderId: string) {
    await this.sendTemplateMessage(to, { '1': name, '2': orderNumber, '3': 'Invoice Available: ' + invoiceUrl }, orderId);
  }
}
