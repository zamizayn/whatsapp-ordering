import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';

export class Setting extends Model {
  declare id: string;
  declare key: string;
  declare value: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Setting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'settings',
  }
);
