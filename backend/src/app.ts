import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import routes from './routes/index.js';
import { setupEventListeners } from './events/listeners.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Storage for invoices
const storageDir = path.join(process.cwd(), 'storage/invoices');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}
app.use('/invoices', express.static(storageDir));

// Routes
app.use('/api', routes);

// Initialize Event Listeners
setupEventListeners();

// Basic health check
app.get('/', (req, res) => {
  res.json({ status: 'Order Tracking System Backend Running' });
});

export default app;
