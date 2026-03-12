import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';
import { Customer } from './Customer.js';

export enum OrderStatus {
  CREATED = 'CREATED',
  ADVANCE_RECEIVED = 'ADVANCE_RECEIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Order extends Model {
  declare id: string;
  declare orderNumber: string;
  declare customerId: string;
  declare description: string;
  declare totalAmount: number;
  declare advanceAmount: number;
  declare expectedDeliveryDate: Date;
  declare readonly createdAt: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'order_number',
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'customer_id',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    advanceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'advance_amount',
    },
    expectedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expected_delivery_date',
    },
  },
  {
    sequelize,
    tableName: 'orders',
  }
);

Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
