import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config";
import bcrypt from "bcryptjs";

class Customer extends Model {
  public id!: number;
  public fname!: string;
  public lname!: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public authorized!: boolean;
  public forcepasswordchange!: boolean;
  public logincount!: number;
  public lastlogindatetime!: Date;
}

Customer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fname: { type: DataTypes.STRING, allowNull: false },
    lname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    logincount: { type: DataTypes.INTEGER,  allowNull: false, defaultValue: 0 },
    lastlogindatetime: { type: DataTypes.DATE, allowNull: true },
    authorized: { type: DataTypes.BOOLEAN, allowNull:false,defaultValue: true },
    forcepasswordchange: { type: DataTypes.BOOLEAN, allowNull:false,defaultValue: false },
  },
  { 
    sequelize, 
    tableName: "customers",
    hooks: {
      beforeCreate: async (customer: Customer) => {
        if (customer.password) {
          customer.password = await bcrypt.hash(customer.password, 10);
        }
      },
      beforeUpdate: async (customer: Customer) => {
        if (customer.changed('password')) {
          customer.password = await bcrypt.hash(customer.password, 10);
        }
      },
    },
  }
);

export default Customer;