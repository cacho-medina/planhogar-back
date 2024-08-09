import { check } from "express-validator";
import resultadoValidacion from "./resultado.validations.js";

const validacionUsuario = [
    check("username")
        .notEmpty()
        .withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 4, max: 40 })
        .withMessage("El nombre de usuario debe tener entre 2 y 40 caracteres"),
    check("email")
        .notEmpty()
        .withMessage("El correo del usuario es obligatorio")
        .matches(/.+\@.+\..+/)
        .withMessage("El correo electronico debe ser valido"),
    check("password").notEmpty().withMessage("la contraseña es obligatoria"),
    check("activo")
        .notEmpty()
        .withMessage("El estado del usuario es obligatorio")
        .isBoolean()
        .withMessage("El estado debe ser booleano"),
    (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionUsuario;
