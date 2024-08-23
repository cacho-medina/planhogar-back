import { Router } from "express";
import productoValidations from "../helpers/validations/products.validations.js";
import {
    activarProducto,
    desactivarProducto,
    getProductoById,
    getProductos,
    postProducto,
    putProducto,
} from "../controllers/productos.controllers.js";
import validarJWT from "../helpers/jwt/validateJWT.js";

const router = Router();

router
    .route("/")
    .get(getProductos)
    .post([productoValidations, validarJWT], postProducto);
router.route("/:id").get(getProductoById);
router.route("/update/:id").put([validarJWT], putProducto); //actualizar producto
router.put("/delete/:id", validarJWT, desactivarProducto); //desactivar producto
router.put("/activate/:id", validarJWT, activarProducto); //activar producto
export default router;
