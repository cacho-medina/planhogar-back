import express from "express";
import clientesRoutes from "./src/routes/clientes.routes.js";
import userRoutes from "./src/routes/usuarios.routes.js";
import planRoutes from "./src/routes/planes.routes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./src/database/connection.js";

const app = express();

const PORT = process.env.PORT || 4004;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/cliente", clientesRoutes);
app.use("/api/usuario", userRoutes);
app.use("/api/plan", planRoutes);

//conexion a base de datos
sequelize
    .sync({ force: false }) //cambiar a false en produccion-
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                "El servidor esta corriedo en: " + `http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.log(error);
    });
