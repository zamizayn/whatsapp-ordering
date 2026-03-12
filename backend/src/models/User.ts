import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database.js';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  DELIVERY = 'DELIVERY',
}

export class User extends Model {
  declare id: string;
  declare name: string;
  declare username: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare readonly createdAt: Date;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init(
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
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: UserRole.STAFF,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('passwordHash')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
    },
  }
);
