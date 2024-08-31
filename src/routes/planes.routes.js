import { Router } from "express";
import {
    getPlan,
    postPlan,
    putPlan,
    deletePlan,
    activarPlan,
    getPlanById,
} from "../controllers/planes.controllers.js";

import validarJWT from "../helpers/jwt/validateJWT.js";
import planesValidations from "../helpers/validations/planes.validations.js";

const router = Router();

router.route("/").get(getPlan).post([validarJWT, planesValidations], postPlan);
router.get("/:id", getPlanById);
router.route("/update/:id").put([validarJWT], putPlan); //actualizar plan
router.put("/delete/:id", validarJWT, deletePlan); //desactivar plan
router.put("/activate/:id", validarJWT, activarPlan); //activar plan

export default router;
