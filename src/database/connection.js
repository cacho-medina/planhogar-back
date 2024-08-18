import { Sequelize } from "sequelize";

const {
    USER_POSTGRES,
    PASS_POSTGRES,
    HOST_POSTGRES,
    PORT_POSTGRES,
    BD_POSTGRES,
} = process.env;

// conectar con postgres
/* const sequelize = new Sequelize(
    `postgres://${USER_POSTGRES}:${PASS_POSTGRES}@${HOST_POSTGRES}:${PORT_POSTGRES}/${BD_POSTGRES}`,
    {
        logging: false,
        native: false,
    }
); */
const sequelize = new Sequelize(
    `postgresql://planhogar_user:yJmFOuJLuQOvbCkJlUMlgxYjGJ2aM6RP@dpg-cr0qporqf0us73fe9dk0-a.ohio-postgres.render.com/planhogar`,
    {
        logging: false,
        native: false,
    }
);

export default sequelize;
