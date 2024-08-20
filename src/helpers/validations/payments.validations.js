import { check } from "express-validator";
import resultadoValidacion from "./resultado.validations.js";

const paymentsValidations = [
    check("monto")
        .notEmpty()
        .withMessage("El monto a pagar es obligatorio")
        .isNumeric()
        .withMessage("El monto debe ser un valor numerico"),
    check("idPlan")
        .notEmpty()
        .withMessage("El numero de plan es necesario para registrar el pago"),
    (req, res, next) => resultadoValidacion(req, res, next),
];

export default paymentsValidations;
