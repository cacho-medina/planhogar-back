import { Router } from "express";
import {
    /* deleteCliente,
    putCliente, */
    getClienteById,
    getClientes,
    postCliente,
} from "../controllers/clientes.controllers.js";

const router = Router();

router.route("/").get(getClientes).post(postCliente);
router.get("/:id", getClienteById);
/* router.route("/:id").put(putCliente).delete(deleteCliente); */

export default router;
