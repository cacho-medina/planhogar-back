import { check } from "express-validator";
import resultadoValidacion from "./resultado.validations.js";

const productoValidations = [
    check("nombre")
        .notEmpty()
        .withMessage("El nombre del producto es obligatorio")
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "El nombre del producto debe tener entre 3 y 100 caracteres"
        ),
    check("cantidad")
        .notEmpty()
        .withMessage("La cantidad debe ser mayor a 1")
        .isNumeric()
        .withMessage("Se debe ingresar un valor numerico para la cantidad")
        .custom((value) => {
            if (value > 0) {
                return true;
            } else {
                throw new Error(
                    "Debe ingresar una cantidad de al menos un producto"
                );
            }
        }),
    (req, res, next) => resultadoValidacion(req, res, next),
];

export default productoValidations;
