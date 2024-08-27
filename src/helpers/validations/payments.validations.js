import { check } from "express-validator";
import resultadoValidacion from "./resultado.validations.js";

const paymentsValidations = [
    check("monto")
        .notEmpty()
        .withMessage("El monto a pagar es obligatorio")
        .isNumeric()
        .withMessage("El monto debe ser un valor numerico")
        .custom((value) => {
            if (value > 1000) {
                return true;
            } else {
                throw new Error("El precio debe ser un valor mayor a 1000");
            }
        }),
    check("idPlan")
        .notEmpty()
        .withMessage("El numero de plan es necesario para registrar el pago"),
    check("documento")
        .notEmpty()
        .withMessage(
            "El documento del cliente es necesario para registrar el pago"
        ),
    check("numeroCuota")
        .notEmpty()
        .withMessage("El numero de la cuota a pagar es obligatorio"),
    (req, res, next) => resultadoValidacion(req, res, next),
];

export default paymentsValidations;
