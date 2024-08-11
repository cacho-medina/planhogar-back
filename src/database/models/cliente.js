import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

export const Cliente = sequelize.define(
    "Cliente",
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
        documento: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [7, 8],
            },
        },
    },
    {
        timestamps: false,
    }
);
