import { Router } from "express";
import {
    getPlan,
    postPlan,
    putPlan,
    deletePlan,
    activarPlan,
    getPlanById,
} from "../controllers/planes.controllers.js";
//AGREGAR JWT
import validarJWT from "../helpers/jwt/validateJWT.js";
import planesValidations from "../helpers/validations/planes.validations.js";

const router = Router();

router.route("/").get(getPlan).post([planesValidations], postPlan);
router.get("/:id", getPlanById);
router.route("/update/:id").put([planesValidations], putPlan); //actualizar plan
router.put("/delete/:id", deletePlan); //desactivar plan
router.put("/activate/:id", activarPlan); //activar plan

export default router;
