import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';
import { Order } from './Order.js';

export class MessageLog extends Model {
  declare id: string;
  declare direction: 'INBOUND' | 'OUTBOUND';
  declare channel: string;
  declare templateId?: string;
  declare status: 'SENT' | 'DELIVERED' | 'FAILED' | 'QUEUED';
  declare relatedOrderId?: string;
  declare readonly timestamp: Date;
}

MessageLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    direction: {
      type: DataTypes.ENUM('INBOUND', 'OUTBOUND'),
      allowNull: false,
    },
    channel: {
      type: DataTypes.STRING,
      defaultValue: 'whatsapp',
    },
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'template_id',
    },
    status: {
      type: DataTypes.ENUM('SENT', 'DELIVERED', 'FAILED', 'QUEUED'),
      allowNull: false,
    },
    relatedOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'related_order_id',
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'message_logs',
    timestamps: false,
  }
);

MessageLog.belongsTo(Order, { foreignKey: 'relatedOrderId', as: 'order' });
Order.hasMany(MessageLog, { foreignKey: 'relatedOrderId', as: 'messageLogs' });
