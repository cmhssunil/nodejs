import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config";

class Group extends Model {
    public id!: number;
    public groupName!: string;
    public description!: string;
    public type!: "static" | "dynamic"; // Enum type
}

Group.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        groupName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM("static", "dynamic"),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "groups",
        timestamps: true,
    }
);

export default Group;
