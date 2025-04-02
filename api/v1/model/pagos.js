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
        pendiente_por_cobrar, total, subtotal, impuestos, created_at, updated_at,
        padre, concepto, referencia, fecha_pago, spei, monto, banco,
        autorizacion_stripe, last_digits, fecha_transaccion, currency,
        metodo_de_pago, tipo_de_tarjeta, tipo_de_pago
      ) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

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
      datosPago.impuestos || null,
      new Date().toISOString().slice(0, 19).replace('T', ' '), // created_at
      new Date().toISOString().slice(0, 19).replace('T', ' '), // updated_at
      datosPago.padre || null,
      datosPago.concepto || null,
      datosPago.referencia || null,
      datosPago.fecha_pago || null,
      datosPago.spei || null,
      datosPago.monto || null,
      datosPago.banco || null,
      datosPago.autorizacion_stripe || null,
      datosPago.last_digits || null,
      datosPago.fecha_transaccion || new Date().toISOString().split('T')[0],
      datosPago.currency || 'mxn',
      datosPago.metodo_de_pago || null,
      datosPago.tipo_de_tarjeta || null,
      datosPago.tipo_de_pago || 'contado'
    ];

    const response = await executeQuery(query, params);
    return ({ success: true });
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

const getCreditoEmpresa = async (body) => {
  try {
    console.log(body)
    const { id_empresa } = body;
    const params = [id_empresa];
    const query = `
    SELECT empresas.id_empresa, empresas.tiene_credito, empresas.monto_credito as monto_credito_empresa, empresas.nombre_comercial, empresas.razon_social, empresas.tipo_persona, agentes.id_agente, agentes.tiene_credito_consolidado,  agentes.monto_credito as monto_credito_agente
    FROM empresas
    JOIN empresas_agentes ON empresas.id_empresa = empresas_agentes.id_empresa
    JOIN agentes ON agentes.id_agente = empresas_agentes.id_agente
    WHERE empresas.id_empresa = 1;`
    const response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
};

const getCreditoAgente = async (body) => {
  try {
    console.log(body)
    const { id_agente } = body;
    const query = `
      SELECT agentes.id_agente, agentes.nombre, agentes.tiene_credito_consolidado, agentes.monto_credito as monto_credito_agente, empresas.id_empresa, empresas.tiene_credito, empresas.monto_credito as monto_credito_empresa, empresas.nombre_comercial, empresas.razon_social, empresas.tipo_persona
      FROM agentes
      JOIN empresas_agentes ON agentes.id_agente = empresas_agentes.id_agente
      JOIN empresas ON empresas.id_empresa = empresas_agentes.id_empresa
      WHERE agentes.id_agente = ?; `;
    const params = [id_agente];
    const response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
};

const getCreditoTodos = async () => {
  try {
    const query = `
      SELECT agentes.id_agente, agentes.nombre, agentes.tiene_credito_consolidado, agentes.monto_credito AS monto_credito_agente, empresas.id_empresa, empresas.tiene_credito, empresas.monto_credito as monto_credito_empresa, empresas.nombre_comercial, empresas.razon_social, empresas.tipo_persona
      FROM agentes
      JOIN empresas_agentes ON agentes.id_agente = empresas_agentes.id_agente
      JOIN empresas ON empresas.id_empresa = empresas_agentes.id_empresa;`;
    const response = await executeQuery(query);
    return response;
  } catch (error) {
    throw error;
  }
};

const editCreditoEmpresa = async (body) => {
  try {
    const { id, credit } = body;
    const query = `UPDATE empresas SET monto_credito = ?, tiene_credito = ? WHERE id_empresa = ?`;
    const params = [credit, (credit > 0), id]
    const response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
}
const editCreditoAgente = async (body) => {
  try {
    const { id, credit } = body;
    const query = `UPDATE agentes SET monto_credito = ?, tiene_credito_consolidado = ? WHERE id_agente = ?`;
    const params = [credit, (credit > 0), id]
    const response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
}

const pagoConCredito = async (body) => {
  try {
    const { id_servicio, monto_a_credito, responsable_pago_empresa, responsable_pago_agente, fecha_creacion, pago_por_credito, pendiente_por_cobrar, total, subtotal, impuestos, tipo_de_pago
    } = body
    const id_pago = `cre-${uuidv4()}`;
    const query = `
    INSERT INTO pagos 
    (
      id_pago, id_servicio, monto_a_credito, responsable_pago_empresa,
      responsable_pago_agente, fecha_creacion, pago_por_credito,
      pendiente_por_cobrar, total, subtotal, impuestos, tipo_de_pago
    ) values (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = [id_pago, id_servicio, monto_a_credito, responsable_pago_empresa, responsable_pago_agente, fecha_creacion, pago_por_credito, pendiente_por_cobrar, total, subtotal, impuestos, tipo_de_pago];
    const response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPagos,
  readPagos,
  getCreditoAgente,
  getCreditoEmpresa,
  getCreditoTodos,
  editCreditoAgente,
  editCreditoEmpresa,
  pagoConCredito
};
