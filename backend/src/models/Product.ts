import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';

export class Product extends Model {
  declare id: string;
  declare name: string;
  declare category: string;
  declare description: string;
  declare price: number;
  declare readonly createdAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'General',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);
