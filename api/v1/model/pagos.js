const { executeQuery } = require("../../../config/db");
const { v4: uuidv4 } = require("uuid");

const createPagos = async (datosPago) => {
    try {
        const id_pago = `pag-${uuidv4()}`;
        const query = `
          INSERT INTO pagos 
          (
            id_pago, id_servicio, monto_a_credito, responsable_pago_empresa,
            responsable_pago_agente, fecha_creacion, pago_por_credito,
            pendiente_por_cobrar, total, subtotal, impuestos
          ) 
          VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

        const params = [
            id_pago,
            datosPago.id_servicio,  // Requerido de la relación con servicios
            datosPago.monto_a_credito || 0.0,  // Campo NOT NULL
            datosPago.responsable_pago_empresa || null,
            datosPago.responsable_pago_agente || null,
            datosPago.fecha_creacion || new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
            datosPago.pago_por_credito || null,
            datosPago.pendiente_por_cobrar || false,
            datosPago.total || null,
            datosPago.subtotal || null,
            datosPago.impuestos || null
        ];

        const response = await executeQuery(query, params);
        return ({success:true});
    } catch (error) {
        throw error;
    }
};

const readPagos = async () => {
    try {
        const query = "SELECT * FROM pagos";
        const response = await executeQuery(query);
        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createPagos,
    readPagos
};
