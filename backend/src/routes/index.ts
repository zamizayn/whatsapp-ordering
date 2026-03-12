import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { WhatsAppWebhookController } from '../whatsapp/webhookController.js';
import { SettingController } from '../controllers/settingController.js';
import { CustomerController } from '../controllers/customerController.js';
import { AuthController } from '../controllers/authController.js';
import { UserController } from '../controllers/userController.js';
import { ProductController } from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserRole } from '../models/index.js';

const router = Router();

// Auth routes
router.post('/auth/setup-admin', AuthController.setupFirstAdmin);
router.post('/auth/login', AuthController.login);
router.get('/auth/profile', authenticate, AuthController.getProfile);

// User management routes (Admin only)
router.get('/users', authenticate, authorize([UserRole.ADMIN]), UserController.list);
router.post('/users', authenticate, authorize([UserRole.ADMIN]), UserController.create);
router.patch('/users/:id', authenticate, authorize([UserRole.ADMIN]), UserController.update);
router.delete('/users/:id', authenticate, authorize([UserRole.ADMIN]), UserController.delete);

// Order routes - All protected
router.post('/orders', authenticate, OrderController.create);
router.get('/orders', authenticate, OrderController.list);
router.get('/orders/:id', authenticate, OrderController.getDetail);
router.patch('/orders/:id/status', authenticate, OrderController.updateStatus);
router.post('/orders/:id/invoice', authenticate, OrderController.generateInvoice);

// Customer routes - All protected
router.get('/customers', authenticate, CustomerController.listCustomers);
router.get('/customers/:id', authenticate, CustomerController.getCustomerDetail);
router.patch('/customers/:id', authenticate, CustomerController.updateCustomer);

// Settings routes - Protected (Admin only)
router.get('/settings', authenticate, authorize([UserRole.ADMIN]), SettingController.getSettings);
router.post('/settings', authenticate, authorize([UserRole.ADMIN]), SettingController.updateSettings);

// Product Catalog routes
router.get('/products', authenticate, ProductController.list);
router.post('/products', authenticate, authorize([UserRole.ADMIN]), ProductController.create);
router.patch('/products/:id', authenticate, authorize([UserRole.ADMIN]), ProductController.update);
router.delete('/products/:id', authenticate, authorize([UserRole.ADMIN]), ProductController.delete);

// Twilio Webhook (Public)
router.post('/webhooks/twilio', WhatsAppWebhookController.handleIncoming);

export default router;
