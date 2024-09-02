import { ClientPlanRelation } from "../database/models/relationsModels/ClientPlan.js";
import { Plan } from "../database/models/Plan.js";
import { Cliente } from "../database/models/Cliente.js";
import { Payment } from "../database/models/Payment.js";
import Producto from "../database/models/producto.js";
import sequelize from "../database/connection.js";

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
/* export const postCliente = async (req, res) => {
    
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
        //7. Actualizar el inventario del plan
        const plan = await Plan.findByPk(ClientPlanRel.idPlan, {
            include: [
                {
                    model: Producto,
                    through: { attributes: [] }, // No incluir atributos de la tabla intermedia
                },
            ],
        });
        if (!plan) {
            return new Error("Plan no encontrado");
        }
        for (let producto of plan.Productos) {
            producto.cantidad -= 1;

            // Guardar cambios del producto
            await producto.save();
        }

        res.status(201).json({ message: "Cliente registrado con exito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al realizar el registro" });
    }
}; */

//-------------------------------------CODIGO REFACTORIZADO-----------------------------------------------------------------------

export const postCliente = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { nombre, documento, idPlan, monto, medio, cobrador } = req.body;

        // Validar la solicitud
        if (!nombre || !documento || !idPlan || !monto || !medio || !cobrador) {
            return res.status(400).json({ message: "Faltan datos necesarios" });
        }

        // Buscar o crear el cliente
        const clienteRegistrado = await findOrCreateCliente(
            nombre,
            documento,
            transaction
        );

        // Verificar estado del plan
        const plan = await validatePlanStatus(idPlan, transaction);

        // Verificar si el cliente ya está asociado al plan
        await checkClientPlanAssociation(
            clienteRegistrado.id,
            idPlan,
            transaction
        );

        // Asociar cliente con el plan y registrar el primer pago
        const clientPlanRel = await associateClientWithPlan(
            clienteRegistrado.id,
            idPlan,
            transaction
        );
        await registerFirstPayment(
            clientPlanRel.id,
            monto,
            medio,
            cobrador,
            transaction
        );

        // Actualizar el inventario de productos
        await updatePlanInventory(clientPlanRel.idPlan, transaction, res);

        // Confirmar la transacción y enviar respuesta
        await transaction.commit();
        res.status(201).json({ message: "Cliente registrado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al realizar el registro" });
    }
};

const findOrCreateCliente = async (nombre, documento, transaction) => {
    let cliente = await Cliente.findOne({
        where: { documento },
        transaction,
    });

    if (!cliente) {
        cliente = await Cliente.create(
            {
                nombre,
                documento,
                isActive: true,
            },
            { transaction }
        );
    }

    return cliente;
};
const validatePlanStatus = async (idPlan, transaction) => {
    const plan = await Plan.findByPk(idPlan, { transaction });

    if (!plan || !plan.isActive) {
        throw new Error("No se puede registrar cliente con plan inactivo");
    }

    return plan;
};
const checkClientPlanAssociation = async (idClient, idPlan, transaction) => {
    const clientPlan = await ClientPlanRelation.findOne({
        where: { idClient, idPlan },
        transaction,
    });

    if (clientPlan) {
        throw new Error("El cliente ya está asociado al plan seleccionado");
    }
};
const associateClientWithPlan = async (idClient, idPlan, transaction) => {
    return await ClientPlanRelation.create(
        {
            idClient,
            idPlan,
            fechaRegistro: new Date(),
        },
        { transaction }
    );
};
const registerFirstPayment = async (
    clientPlanId,
    monto,
    medio,
    cobrador,
    transaction
) => {
    return await Payment.create(
        {
            monto,
            medio,
            cobrador,
            fecha: new Date(),
            clientPlanId,
            numeroCuota: 1,
        },
        { transaction }
    );
};
const updatePlanInventory = async (idPlan, transaction, res) => {
    const plan = await Plan.findByPk(idPlan, {
        include: [
            {
                model: Producto,
                through: { attributes: ["cantidad"] },
            },
        ],
        transaction,
    });

    if (!plan) {
        throw new Error("Plan no encontrado");
    }

    // Verificar el stock disponible para cada producto
    for (const producto of plan.Productos) {
        if (producto.cantidad < producto.PlanProducto.cantidad) {
            await transaction.rollback();
            throw new Error(`No hay suficiente stock de ${producto.nombre}`);
        }
    }

    // Reducir el stock de cada producto
    for (const producto of plan.Productos) {
        producto.cantidad -= producto.PlanProducto.cantidad;
        await producto.save({ transaction });
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
