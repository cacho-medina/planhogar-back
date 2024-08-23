import { DataTypes } from "sequelize";
import sequelize from "../../connection.js";
import Producto from "../Producto.js";
import { Plan } from "../Plan.js";

export const PlanProducto = sequelize.define(
    "PlanProducto",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        idPlan: {
            type: DataTypes.UUID,
            references: {
                model: "Plans", // Nombre de la tabla de Planes
                key: "id",
            },
            allowNull: false,
        },
        idProducto: {
            type: DataTypes.UUID,
            references: {
                model: "Productos", // Nombre de la tabla de Productos
                key: "id",
            },
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

//Un producto pertenece a muchos planes y un plan tiene muchos productos
Plan.belongsToMany(Producto, { through: PlanProducto, foreignKey: "idPlan" });
Producto.belongsToMany(Plan, {
    through: PlanProducto,
    foreignKey: "idProducto",
});
