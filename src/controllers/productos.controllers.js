import Producto from "../database/models/Producto.js";

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se encontraron productos" });
    }
};
export const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        res.status(200).json(producto);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener el producto" });
    }
};
export const postProducto = async (req, res) => {
    const { nombre, cantidad } = req.body;
    try {
        const producto = await Producto.findOne({ where: { nombre } });
        if (producto) {
            return res.status(404).json({
                message: "Se encontró un producto existente con ese nombre",
            });
        }
        const nuevoProducto = await Producto.create({
            nombre,
            cantidad,
            isActive: true,
        });

        res.status(201).json({ message: "Producto creado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "El producto no pudo ser registrado" });
    }
};
export const putProducto = async (req, res) => {
    const { nombre, cantidad } = req.body;
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res
                .status(404)
                .json({ message: "El producto no fue encontrado" });
        }
        if (nombre) {
            const nombreExist = await Producto.findOne({
                where: { nombre },
            });
            if (nombreExist) {
                return res
                    .status(400)
                    .json({ message: "Ya existe un producto con ese nombre" });
            }
            producto.nombre = nombre;
        }
        if (cantidad) {
            producto.cantidad = cantidad;
        }
        await producto.save();
        res.status(200).json({ message: "producto actualizado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};
export const desactivarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res
                .status(404)
                .json({ message: "El producto no fue encontrado" });
        }
        producto.isActive = false;
        await producto.save();
        res.status(200).json({ message: "Producto desactivado con exito" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Error al desactivar el producto" });
    }
};
export const activarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res
                .status(404)
                .json({ message: "El producto no fue encontrado" });
        }
        producto.isActive = true;
        await producto.save();
        res.status(200).json({ message: "Producto activado con exito" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Error al activar el producto" });
    }
};
