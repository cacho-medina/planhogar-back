import { ClientPlanRelation } from "../database/models/relationsModels/ClientPlan.js";
import { Plan } from "../database/models/Plan.js";
import { Cliente } from "../database/models/Cliente.js";
import { Payment } from "../database/models/Payment.js";

export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener los clientes" });
    }
};

//DEBE REGISTRAR EL CLIENTE, ASOCIARLO A UN PLAN Y REGISTRAR EL PRIMER PAGO
//DEL BODY LLEGA cliente(nombre,documento,isActive:true), plan(id) y pago(monto, fecha)
export const postCliente = async (req, res) => {
    //MEJORAR PARA QUE NO SE CREE UN REGISTRO DE UN CLIENTE CON UN PLAN CUANDO YA EXISTE
    //ACTUALMENTE CREA UN REGISTRO DEL PAYMENT PERO NO UN REGISTRO NUEVO ENTRE EL CLIENTE Y EL PLAN
    try {
        const { nombre, documento, idPlan, monto, medio, cobrador } = req.body;
        const fecha = new Date();
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
        //3. Verifica si el plan esta inactivo
        let planStatus = await Plan.findByPk(idPlan);
        if (!planStatus.isActive) {
            return res.status(404).json({
                message: "No se puede registrar cliente con plan inactivo",
            });
        }
        //4. Verifica si hay un registro del cliente con el plan seleccionado
        let ClientPlanRel = await ClientPlanRelation.findOne({
            where: { idPlan, idClient: clienteRegistrado.id },
        });
        if (ClientPlanRel) {
            return res.status(404).json({
                message: "El cliente ya esta asociado al plan seleccionado",
            });
        }
        // 5. Asociar el cliente con el plan en la tabla intermedia
        ClientPlanRel = await ClientPlanRelation.create({
            idPlan,
            idClient: clienteRegistrado.id,
            fechaRegistro: fecha, //verificar si se ajusta a necesidades
        });
        //6. Registrar primer pago
        await Payment.create({
            monto,
            cobrador,
            medio,
            fecha,
            clientPlanId: ClientPlanRel.id,
            numeroCuota: 1, //se establece que es la primera cuota
        });
        res.status(201).json({ message: "Cliente registrado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al realizar el registro" });
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
        const planesByIdClient = await ClientPlanRelation.findAll({
            where: { idClient: req.params.id },
        });
        if (planesByIdClient.length === 0) {
            return res
                .status(404)
                .json({ message: "El cliente no posee planes asociados" });
        }
        // 3. Formatear la respuesta para incluir cliente, planes y pagos
        const planesConPagos = await Promise.all(
            planesByIdClient.map(async (planRelation) => {
                const pagosRelClient = await Payment.findAll({
                    where: { clientPlanId: planRelation.id },
                });
                return {
                    plan: await Plan.findByPk(planRelation.idPlan),
                    pagosByPlan: pagosRelClient,
                };
            })
        );
        // 4. Responder con los datos del cliente, planes y pagos
        res.status(200).json({ cliente, planes: planesConPagos });
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
