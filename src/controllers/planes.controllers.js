import { Plan } from "../database/models/Plan.js";
import { PlanProducto } from "../database/models/relationsModels/PlanProducto.js";
import Producto from "../database/models/Producto.js";

export const getPlan = async (req, res) => {
    try {
        const planes = await Plan.findAll();
        res.status(200).json(planes);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener los planes" });
    }
};
export const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findByPk(req.params.id, {
            include: [
                {
                    model: Producto,
                    through: { attributes: [] }, // No incluir atributos de la tabla intermedia
                },
            ],
        });
        if (!plan) {
            return res.status(404).json({
                message: "Plan no encontrado.",
            });
        }
        /* const productos = plan.Productos;

        // 4. Verificar si el plan tiene productos asociados
        if (productos.length === 0) {
            return res.status(404).json({
                message: "El plan no posee productos asociados",
            });
        } */
        res.status(200).json(plan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener datos del plan" });
    }
};
export const postPlan = async (req, res) => {
    const { nombre, productosIds } = req.body;
    try {
        const plan = await Plan.findOne({ where: { nombre } });
        if (plan) {
            return res.status(404).json({
                message: "Se encontró un plan existente con ese nombre",
            });
        }
        const nuevoPlan = await Plan.create({ nombre, isActive: true });
        // Si se proporcionan IDs de productos, asociar el plan a esos productos
        if (productosIds && productosIds.length > 0) {
            const productos = await Producto.findAll({
                where: { id: productosIds },
            });
            await nuevoPlan.addProductos(productos); // Asocia los productos al plan
        }
        res.status(201).json({ message: "PLan creado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "El plan no pudo ser registrado" });
    }
};
export const putPlan = async (req, res) => {
    const { nombre, productosIds } = req.body;
    try {
        const plan = await Plan.findByPk(req.params.id, {
            include: [
                {
                    model: Producto,
                    through: { attributes: [] }, // No incluir atributos de la tabla intermedia
                },
            ],
        });
        if (!plan) {
            return res
                .status(404)
                .json({ message: "El plan no fue encontrado" });
        }
        if (nombre) {
            const nombreExist = await Plan.findOne({
                where: { nombre },
            });
            if (nombreExist) {
                return res
                    .status(400)
                    .json({ message: "Ya existe un plan con ese nombre" });
            }
            plan.nombre = req.body.nombre;
        }
        // Si se proporcionan IDs de productos, reemplazar las asociaciones
        if (productosIds && productosIds.length > 0) {
            // Buscar los productos por sus IDs
            const nuevosProductos = await Producto.findAll({
                where: { id: productosIds },
            });

            // Reemplazar los productos asociados al plan
            await plan.setProductos(nuevosProductos);
        }

        // Guardar los cambios en el plan
        await plan.save();
        res.status(200).json({ message: "Plan actualizado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el plan" });
    }
};
export const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByPk(req.params.id);
        if (!plan) {
            return res
                .status(404)
                .json({ message: "El plan no fue encontrado" });
        }
        plan.isActive = false;
        await plan.save();
        res.status(200).json({ message: "Plan desactivado con exito" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar el plan" });
    }
};
export const activarPlan = async (req, res) => {
    try {
        const plan = await Plan.findByPk(req.params.id);
        if (!plan) {
            return res
                .status(404)
                .json({ message: "El plan no fue encontrado" });
        }
        plan.isActive = true;
        await plan.save();
        res.status(200).json({ message: "Plan activado con exito" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al activar el plan" });
    }
};
