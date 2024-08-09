import { Sequelize } from "sequelize";

const {
    USER_POSTGRES,
    PASS_POSTGRES,
    HOST_POSTGRES,
    PORT_POSTGRES,
    BD_POSTGRES,
} = process.env;

// conectar con postgres
const sequelize = new Sequelize(
    `postgres://${USER_POSTGRES}:${PASS_POSTGRES}@${HOST_POSTGRES}:${PORT_POSTGRES}/${BD_POSTGRES}`,
    {
        logging: console.log,
        native: false,
    }
);

export default sequelize;
