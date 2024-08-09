import { Router } from "express";
import validacionUsuario from "../helpers/validations/usuario.validations.js";
import {
    postUser,
    deleteUser,
    getUsers,
    login,
} from "../controllers/usuarios.controllers.js";

const router = Router();

router.route("/").get(getUsers).post([validacionUsuario], postUser);
router.route("/:id").delete(deleteUser);
router.route("/auth").post(login);

export default router;
