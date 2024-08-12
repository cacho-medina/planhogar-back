import { DataTypes } from "sequelize";
import sequelize from "../connection.js";

const Usuario = sequelize.define(
    "User",
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true, // Debe ser un email válido
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export default Usuario;
