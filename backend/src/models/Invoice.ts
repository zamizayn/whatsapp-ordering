import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';
import { Order } from './Order.js';

export class Invoice extends Model {
  declare id: string;
  declare orderId: string;
  declare invoiceNumber: string;
  declare pdfUrl: string;
  declare readonly generatedAt: Date;
}

Invoice.init(
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
    invoiceNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'invoice_number',
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pdf_url',
    },
    generatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'generated_at',
    },
  },
  {
    sequelize,
    tableName: 'invoices',
    timestamps: false,
  }
);

Invoice.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(Invoice, { foreignKey: 'orderId', as: 'invoices' });
