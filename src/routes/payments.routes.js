import { Router } from "express";
import {
    getPagosByClient,
    getPagos,
    postPagos,
} from "../controllers/payments.controllers.js";
import paymentsValidations from "../helpers/validations/payments.validations.js";
import validarJWT from "../helpers/jwt/validateJWT.js";
const router = Router();

router.route("/registrar").post([validarJWT, paymentsValidations], postPagos);
router.get("/", getPagos);
router.get("/:id", getPagosByClient);

export default router;
