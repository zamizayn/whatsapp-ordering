import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';
import { Order, OrderStatus } from './Order.js';

export class OrderStatusHistory extends Model {
  declare id: string;
  declare orderId: string;
  declare status: OrderStatus;
  declare actor: string;
  declare readonly timestamp: Date;
}

OrderStatusHistory.init(
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
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
    },
    actor: {
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
    tableName: 'order_status_history',
    timestamps: false,
  }
);

OrderStatusHistory.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(OrderStatusHistory, { foreignKey: 'orderId', as: 'statusHistory' });
