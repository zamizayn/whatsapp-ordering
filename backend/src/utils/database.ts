import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

export default sequelize;
