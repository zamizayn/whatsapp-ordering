import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';
import { Order } from './Order.js';

export class OrderItem extends Model {
  declare id: string;
  declare orderId: string;
  declare productName: string;
  declare quantity: number;
  declare unitPrice: number;
  declare readonly createdAt: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'product_name',
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price',
    },
  },
  {
    sequelize,
    tableName: 'order_items',
  }
);

OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
