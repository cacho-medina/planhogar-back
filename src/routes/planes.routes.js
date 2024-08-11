import { Router } from "express";
import {
    getPlan,
    postPlan,
    putPlan,
    deletePlan,
    activarPlan,
} from "../controllers/planes.controllers.js";

const router = Router();

router.route("/").get(getPlan).post(postPlan);
router.route("/update/:id").put(putPlan); //actualizar plan
router.put("/delete/:id", deletePlan); //desactivar plan
router.put("/activate/:id", activarPlan); //activar plan

export default router;
