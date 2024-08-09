import { Router } from "express";
import {
    deleteCliente,
    getClienteById,
    getClientes,
    postCliente,
    putCliente,
} from "../controllers/clientes.controllers.js";

const router = Router();

router.get("/clientes", getClientes);
router.post("/cliente", postCliente);
router
    .route("/cliente/:id")
    .get(getClienteById)
    .put(putCliente)
    .delete(deleteCliente);

export default router;
