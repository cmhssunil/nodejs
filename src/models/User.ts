import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config";
import bcrypt from "bcryptjs";

class User extends Model {
  public id!: number;
  public username!: string;
  public useremail!: string;
  public phone!: string;
  public password!: string;
  public type!: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    useremail: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("super_admin", "sub_admin"), allowNull: false },
  },
  { 
    sequelize, 
    tableName: "users",
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    }, 
  }
);



export default User;