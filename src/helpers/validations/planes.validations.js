import { check } from "express-validator";
import resultadoValidacion from "./resultado.validations.js";

const planesValidations = [
    check("nombre")
        .notEmpty()
        .withMessage("El nombre del plan es obligatorio")
        .isLength({ min: 3, max: 100 })
        .withMessage("El nombre del plan debe tener entre 3 y 100 caracteres"),
    (req, res, next) => resultadoValidacion(req, res, next),
];

export default planesValidations;
