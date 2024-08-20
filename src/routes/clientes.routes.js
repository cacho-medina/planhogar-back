import { Router } from "express";
import {
    /* deleteCliente,
    putCliente, */
    getClienteById,
    getClientes,
    postCliente,
} from "../controllers/clientes.controllers.js";
import validacionCliente from "../helpers/validations/clientes.validations.js";

const router = Router();

router.route("/").get(getClientes).post([validacionCliente], postCliente);
router.get("/:id", getClienteById);
//Rutas para editar info de cliente o eliminar/deshabilitar cliente
/* router.route("/:id").put(putCliente).delete(deleteCliente); */

export default router;
