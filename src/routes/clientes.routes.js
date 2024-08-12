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
/* router.route("/:id").put(putCliente).delete(deleteCliente); */

export default router;
