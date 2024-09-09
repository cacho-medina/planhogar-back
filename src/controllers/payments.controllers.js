import { ClientPlanRelation } from "../database/models/relationsModels/ClientPlan.js";
import { Payment } from "../database/models/Payment.js";
import { Cliente } from "../database/models/Cliente.js";
import { Plan } from "../database/models/Plan.js";

export const getPagos = async (req, res) => {
    try {
        const pagosRegistrados = await Payment.findAll({
            include: [
                {
                    model: ClientPlanRelation,
                    include: [
                        { model: Cliente, attributes: ["nombre", "documento"] },
                        { model: Plan, attributes: ["nombre"] },
                    ],
                },
            ],
            order: [["fecha", "DESC"]],
        });
        /* if (pagosRegistrados.length === 0) {
            return res.status(404).json({
                message:
                    "No se encontraron pagos registrados en la base de datos.",
            });
        } */
        res.status(200).json(pagosRegistrados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los pagos" });
    }
};

export const getPagosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const pagosByClient = await Payment.findAll({
            where: { idClient: id },
            order: [["fecha", "DESC"]],
        });
        if (pagosByClient.length === 0) {
            return res.status(404).json({
                message: "No se encontraron pagos registrados por el cliente",
            });
        }
        res.status(200).json(pagosByClient);
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        res.status(500).json({
            message: "Ocurrió un error al procesar la solicitud.",
        });
    }
};
export const getPagosByClientAndPlan = async (req, res) => {
    const { idPlan } = req.body;
    const { id } = req.params;
    try {
        const pagosByClientAndPlan = await Payment.findAll({
            where: { idPlan, idClient: id },
            order: [["fecha", "DESC"]],
        });
        if (pagosByClientAndPlan.length === 0) {
            return res.status(404).json({
                message:
                    "No se encontraron pagos registrados por el cliente, al plan seleccionado",
            });
        }
        res.status(200).json(pagosByClientAndPlan);
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        res.status(500).json({
            message: "Ocurrió un error al procesar la solicitud.",
        });
    }
};
export const postPagos = async (req, res) => {
    const { monto, idPlan, numeroCuota, documento, medio, cobrador } = req.body;
    try {
        //busca el cliente mediante su nombre y documento
        const cliente = await Cliente.findOne({ where: { documento } });
        if (!cliente) {
            return res.status(404).json({
                message: "No existe cliente registrado con ese documento",
            });
        }

        //verifica que el cliente esté asociado al plan seleccionado
        const planByClient = await ClientPlanRelation.findOne({
            where: { idPlan, idClient: cliente.id },
        });
        if (!planByClient) {
            return res.status(404).json({
                message: "El cliente no esta asociado plan seleccionado",
            });
        }
        //verificar si ya se pago por completo el plan
        if (numeroCuota > planByClient.extension) {
            return res.status(500).json({
                message:
                    "No se puede registrar el pago de cuotas excedentes a la extension del plan",
            });
        }

        //verificar si el numero de cuota a pagar ya esta registrado
        const pagoRegistrado = await Payment.findOne({
            where: { clientPlanId: planByClient.id, numeroCuota },
        });
        if (pagoRegistrado) {
            return res
                .status(400)
                .json({ message: "El pago ya esta registrado" });
        }
        //crear el pago
        const pago = await Payment.create({
            monto,
            fecha: new Date(),
            clientPlanId: planByClient.id,
            numeroCuota,
            cobrador,
            medio,
        });
        res.status(201).json({ message: "Pago registrado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al registrar el registrar el pago",
        });
    }
};
