import { Router } from "express";
import {
    deleteCliente,
    getClienteById,
    getClientes,
    postCliente,
    putCliente,
} from "../controllers/clientes.controllers.js";

const router = Router();

router.route("/").get(getClientes).post(postCliente);
router.route("/:id").get(getClienteById).put(putCliente).delete(deleteCliente);

export default router;
