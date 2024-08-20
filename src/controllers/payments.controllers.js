import { ClientPlanRelation } from "../database/models/relationsModels/ClientPlan.js";
import { Payment } from "../database/models/Payment.js";

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
    const { monto, idPlan, numeroCuota, idClient } = req.body;
    try {
        //verifica que el cliente esté asociado al plan seleccionado
        const planByClient = await ClientPlanRelation.findOne({
            where: { idPlan, idClient },
        });
        if (!planByClient) {
            return res.status(404).json({
                message: "El cliente esta asociado plan seleccionado",
            });
        }
        console.log(planByClient.id);
        //crear el pago
        const pago = await Payment.create({
            monto,
            fecha: new Date(),
            clientPlanId: planByClient.id,
            numeroCuota,
        });
        res.status(201).json({ message: "Pago registrado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al registrar el registrar el pago",
        });
    }
};
