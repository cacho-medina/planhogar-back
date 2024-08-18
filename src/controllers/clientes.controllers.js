import { Cliente } from "../database/models/Cliente.js";
import { ClientPlanRelation } from "../database/models/relationsModels/ClientPlan.js";
import { Plan } from "../database/models/Plan.js";

export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener los clientes" });
    }
};

//DEBE REGISTRAR EL CLIENTE Y ASOCIARLO A UN PLAN
//DEL BODY LLEGA cliente(nombre,documento,isActive:true) y plan(id,nombre)
export const postCliente = async (req, res) => {
    try {
        const { nombre, documento, idPlan } = req.body;
        // 1. Buscar si el cliente ya está registrado por documento
        let clienteRegistrado = await Cliente.findOne({
            where: { documento },
        });
        // 2. Si el cliente no existe, crearlo
        if (!clienteRegistrado) {
            clienteRegistrado = await Cliente.create({
                nombre,
                documento,
                isActive: true,
            });
        }
        let planStatus = await Plan.findByPk(idPlan);
        if (!planStatus.isActive) {
            return res
                .status(404)
                .json({
                    message: "No se puede registrar cliente con plan inactivo",
                });
        }
        // 3. Asociar el cliente con el plan en la tabla intermedia
        await ClientPlanRelation.create({
            idPlan,
            idClient: clienteRegistrado.id,
        });
        res.status(201).json({ message: "Cliente registrado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "El cliente no pudo ser registrado" });
    }
};
export const getClienteById = async (req, res) => {
    try {
        // 1. Verificar si el cliente existe
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({
                message: "Cliente no encontrado.",
            });
        }
        // 2. Encontrar los planes asociados al cliente
        /* const planes = await Plan.findAll({
            include: [
                {
                    model: Cliente,
                    through: {
                        where: { idClient: req.params.id },
                    },
                    attributes: [], // No se necesitan atributos de la tabla Cliente en el resultado final
                },
            ],
        }); */
        const planes = await cliente.getPlans();
        res.status(200).json({ cliente, planes });
    } catch (error) {
        console.error(error);
        res.status(404).json({
            message: "No se pudo obtener los datos del cliente",
        });
    }
};
/* export const putCliente = (req, res) => {
    try {
        res.status(200).json({});
    } catch (error) {
        console.error(error);
        res.status().json({});
    }
}; */
/* export const deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res
                .status(404)
                .json({ message: "El cliente no fue encontrado" });
        }
        cliente.isActive = false;
        await cliente.save();
        res.status(200).json({ message: "Cliente desactivado con exito" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar el cliente" });
    }
};
export const activarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res
                .status(404)
                .json({ message: "El cliente no fue encontrado" });
        }
        cliente.isActive = true;
        await plan.save();
        res.status(200).json({ message: "Plan activado con exito" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al activar el cliente" });
    }
}; */
