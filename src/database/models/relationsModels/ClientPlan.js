import { DataTypes } from "sequelize";
import sequelize from "../../connection.js";
import { Cliente } from "../Cliente.js";
import { Plan } from "../Plan.js";

export const ClientPlanRelation = sequelize.define(
    "ClientPlan",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        idClient: {
            type: DataTypes.UUIDV4,
            references: {
                model: Cliente,
                key: "id",
            },
            allowNull: false,
        },
        idPlan: {
            type: DataTypes.UUIDV4,
            references: {
                model: Plan,
                key: "id",
            },
            allowNull: false,
        },
        fechaRegistro: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

Cliente.belongsToMany(Plan, {
    through: ClientPlanRelation,
    foreignKey: "idClient",
});
Plan.belongsToMany(Cliente, {
    through: ClientPlanRelation,
    foreignKey: "idPlan",
});

//TABLA INTERMEDIA QUE ALMACENA RELACIONES ENTRE CLIENTES Y PLANES
//UN CLIENTE TIENE VARIOS PLANES PERO UN PLAN PUEDE PERTENECER A VARIOS CLIENTES
