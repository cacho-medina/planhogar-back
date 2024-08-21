import { Plan } from "../database/models/Plan.js";

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
        const plan = await Plan.findByPk(req.params.id);
        res.status(200).json(plan);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener el plan" });
    }
};
export const postPlan = async (req, res) => {
    try {
        const plan = await Plan.findOne({ where: { nombre: req.body.nombre } });
        if (plan) {
            return res.status(404).json({
                message: "Se encontró un plan existente con ese nombre",
            });
        }
        await Plan.create({ nombre: req.body.nombre, isActive: true });
        res.status(201).json({ message: "PLan creado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "El plan no pudo ser registrado" });
    }
};
export const putPlan = async (req, res) => {
    try {
        const plan = await Plan.findByPk(req.params.id);
        if (!plan) {
            return res
                .status(404)
                .json({ message: "El plan no fue encontrado" });
        }
        plan.nombre = req.body.nombre;
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
