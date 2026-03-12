import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';
import { Order } from './Order.js';

export class Payment extends Model {
  declare id: string;
  declare orderId: string;
  declare amount: number;
  declare paymentType: 'ADVANCE' | 'BALANCE';
  declare method: string;
  declare readonly timestamp: Date;
}

Payment.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.ENUM('ADVANCE', 'BALANCE'),
      allowNull: false,
      field: 'payment_type',
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: false,
  }
);

Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
