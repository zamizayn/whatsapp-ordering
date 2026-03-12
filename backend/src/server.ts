import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // In production, you'd use migrations. For MVP development, sync works.
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models (creates tables)
    try {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    } catch (syncError: any) {
      if (syncError.name === 'SequelizeUnknownConstraintError') {
        console.warn('Sync conflict detected, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized after retry.');
      } else {
        throw syncError;
      }
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
