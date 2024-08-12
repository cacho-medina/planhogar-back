import { DataTypes } from "sequelize";
import sequelize from "../connection.js";
import { ClientPlanRelation } from "./relationsModels/ClientPlan.js";

export const Payment = sequelize.define(
    "Payment",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        monto: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        idClient: {
            type: DataTypes.UUID,
            references: {
                model: ClientPlanRelation,
                key: "idClient",
            },
            allowNull: false,
        },
        idPlan: {
            type: DataTypes.UUID,
            references: {
                model: ClientPlanRelation,
                key: "idPlan",
            },
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

ClientPlanRelation.hasMany(Payment, { foreignKey: "clientPlanId" });
Payment.belongsTo(ClientPlanRelation, { foreignKey: "clientPlanId" });
