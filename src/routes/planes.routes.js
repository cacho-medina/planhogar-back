import { Router } from "express";
import {
    getPlan,
    postPlan,
    putPlan,
    deletePlan,
} from "../controllers/planes.controllers.js";

const router = Router();

router.route("/").get(getPlan).post(postPlan);
router.route("/:id").put(putPlan).delete(deletePlan);

export default router;
