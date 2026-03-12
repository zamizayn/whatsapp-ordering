import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';

export class Customer extends Model {
  declare id: string;
  declare name: string;
  declare phoneNumber: string;
  declare email?: string;
  declare readonly createdAt: Date;
}

Customer.init(
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
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'phone_number',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'customers',
  }
);
