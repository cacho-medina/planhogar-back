import { DataTypes } from "sequelize";
import sequelize from "../connection.js";
import { ClientPlanRelation } from "./relationsModels/ClientPlan.js";
import { Cliente } from "./Cliente.js";
import { Plan } from "./Plan.js";

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
            allowNull: false,
        },
        numeroCuota: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        medio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cobrador: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clientPlanId: {
            type: DataTypes.UUID,
            references: {
                model: ClientPlanRelation,
                key: "id",
            },
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

ClientPlanRelation.hasMany(Payment, {
    foreignKey: "clientPlanId",
});
Payment.belongsTo(ClientPlanRelation, {
    foreignKey: "clientPlanId",
});

ClientPlanRelation.belongsTo(Cliente, { foreignKey: "idClient" });
ClientPlanRelation.belongsTo(Plan, { foreignKey: "idPlan" });
