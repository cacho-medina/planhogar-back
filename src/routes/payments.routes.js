import { Router } from "express";
import {
    getPagosByClient,
    getPagosByClientAndPlan,
    postPagos,
} from "../controllers/payments.controllers.js";
import paymentsValidations from "../helpers/validations/payments.validations.js";
const router = Router();

router.route("/registrar").post([paymentsValidations], postPagos);
router.get("/:id", getPagosByClient);

export default router;
