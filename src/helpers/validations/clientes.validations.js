import { check } from "express-validator";
import resultadoValidacion from "./resultado.validations.js";

const validacionCliente = [
    check("nombre")
        .notEmpty()
        .withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 4, max: 100 })
        .withMessage(
            "El nombre completo de cliente debe tener entre 4 y 100 caracteres"
        ),
    check("documento")
        .notEmpty()
        .withMessage("El documento del cliente es obligatorio")
        .isNumeric()
        .withMessage("El documento debe ser un valor numerico")
        .isLength({ min: 7, max: 8 })
        .withMessage("El numero de documento debe ser valido"),
    check("idPlan")
        .notEmpty()
        .withMessage("Es necesario que seleccione un plan"),
    check("monto")
        .notEmpty()
        .withMessage("El monto de la primera cuota es obligatorio"),
    check("medio").notEmpty().withMessage("El medio de pago es obligatorio"),
    check("cobrador")
        .notEmpty()
        .withMessage("El nombre del cobrador es obligatorio"),
    (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionCliente;
