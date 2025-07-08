import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config";
import Customer from "./Customer";
import Group from "./Group";

class CustomerGroup extends Model {
  public id!: number;
  public customer_id!: number;
  public group_id!: number;
  
}

CustomerGroup.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Customer,
          key: 'id',
        },
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Group,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'customer_groups',
    }
  );
  
  // Define Many-to-Many Relationships
Customer.belongsToMany(Group, { through: CustomerGroup, foreignKey: "customer_id" });
Group.belongsToMany(Customer, { through: CustomerGroup, foreignKey: "group_id" });

// Define Associations Explicitly
CustomerGroup.belongsTo(Customer, { foreignKey: "customer_id" });
CustomerGroup.belongsTo(Group, { foreignKey: "group_id" });
  
  export default CustomerGroup;