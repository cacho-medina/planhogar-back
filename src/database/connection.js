import pg from "pg";
import { Sequelize } from "sequelize";

const {
    USER_POSTGRES,
    PASS_POSTGRES,
    HOST_POSTGRES,
    PORT_POSTGRES,
    BD_POSTGRES,
    POSTGRES_URI,
} = process.env;

// conectar con postgres
const sequelize = new Sequelize(
    `postgres://${USER_POSTGRES}:${PASS_POSTGRES}@${HOST_POSTGRES}:${PORT_POSTGRES}/${BD_POSTGRES}`,
    {
        logging: false,
        native: false,
    }
);
/* const sequelize = new Sequelize(`${POSTGRES_URI}`, {
    dialect: "postgres",
    dialectModule: pg,
}); */

export default sequelize;
