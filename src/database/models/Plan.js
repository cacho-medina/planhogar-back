import sequelize from "../connection.js";
import { DataTypes } from "sequelize";

const Plan = sequelize.define(
    "Plan",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);
