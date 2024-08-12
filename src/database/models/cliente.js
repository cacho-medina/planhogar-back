import { DataTypes } from "sequelize";
import sequelize from "../connection.js";

export const Cliente = sequelize.define(
    "Client",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 100],
            },
        },
        documento: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [7, 8],
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);
