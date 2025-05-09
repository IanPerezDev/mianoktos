const { executeTransaction, executeQuery } = require("../../../config/db");
const { v4: uuidv4 } = require("uuid");

const createSolicitudYTicket = async (solicitud) => {
  try {
    let query = `INSERT INTO solicitudes (confirmation_code, id_viajero, hotel, check_in, check_out, room, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [
      solicitud.confirmation_code,
      solicitud.id_viajero,
      solicitud.hotel_name,
      solicitud.check_in,
      solicitud.check_out,
      solicitud.room_type,
      solicitud.total_price,
      solicitud.status,
    ];

    let response = await executeTransaction(
      query,
      params,
      async (results, connection) => {
        console.log("Creamos el ticket");
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const createSolicitudes = async (body) => {
  try {
    const { solicitudes } = body;
    console.log(solicitudes);
    const id_servicio = `ser-${uuidv4()}`;
    const query_servicio = `INSERT INTO servicios (id_servicio, total, subtotal, impuestos, is_credito, otros_impuestos, fecha_limite_pago) VALUES (?,?,?,?,?,?,?);`;
    const total = solicitudes.reduce(
      (prev, current) => prev + current.total,
      0
    );
    const subtotal = parseFloat((total * 0.84).toFixed(2));
    const impuestos = parseFloat((total * 0.16).toFixed(2));
    const params_servicio = [
      id_servicio,
      total,
      subtotal,
      impuestos,
      null,
      null,
      null,
    ];

    const response = await executeTransaction(
      query_servicio,
      params_servicio,
      async (results, connection) => {
        try {
          const query_solicitudes = `INSERT INTO solicitudes (id_solicitud, id_servicio, id_usuario_generador, confirmation_code, id_viajero, hotel, check_in, check_out, room, total, status, nombre_viajero) VALUES ${solicitudes
            .map(() => "(?,?,?,?,?,?,?,?,?,?,?,?)")
            .join(",")};`;

          const params_solicitudes_map = solicitudes.map((solicitud) => {
            let id_solicitud = `sol-${uuidv4()}`;
            // Correct destructuring to match incoming data keys
            const {
              confirmation_code,
              id_agente,
              hotel,
              check_in,
              check_out,
              room,
              total,
              status,
              id_viajero,
              nombre_viajero,
            } = solicitud;
            return [
              id_solicitud,
              id_servicio,
              id_agente,
              confirmation_code,
              id_viajero,
              hotel,
              check_in,
              check_out,
              room,
              total,
              status,
              nombre_viajero,
            ];
          });
          const params_solicitudes_flat = params_solicitudes_map.flat();

          const response_solicitudes = await connection.execute(
            query_solicitudes,
            params_solicitudes_flat
          );
          return params_solicitudes_map.map((list) => list[0]);
        } catch (error) {
          throw error;
        }
      }
    );

    return { id_servicio: id_servicio, response };
  } catch (error) {
    throw error;
  }
};

const getSolicitudes = async () => {
  try {
    let query = `select 
s.id_servicio,
s.created_at,
s.is_credito,
so.*,
b.id_booking,  
p.id_pago,
p_c.id_credito, 
p_c.pendiente_por_cobrar,
p.monto_a_credito,
vw.primer_nombre,
vw.apellido_paterno
from solicitudes as so
LEFT JOIN servicios as s ON so.id_servicio = s.id_servicio
LEFT JOIN bookings as b ON so.id_solicitud = b.id_solicitud
LEFT JOIN pagos_credito as p_c ON s.id_servicio = p_c.id_servicio
LEFT JOIN pagos as p ON so.id_servicio = p.id_servicio
LEFT JOIN viajeros_con_empresas_con_agentes as vw ON vw.id_agente = so.id_viajero
WHERE p.id_pago IS NOT NULL OR p_c.id_credito IS NOT NULL 
GROUP BY so.id_solicitud
ORDER BY s.created_at DESC;`;
    let response = await executeQuery(query);
    console.log(response);

    let group_service = response.reduce((acc, item) => {
      if (!acc[item.id_servicio]) {
        acc[item.id_servicio] = [];
      }
      acc[item.id_servicio].push(item);
      return acc;
    }, {});
    let array_services = Object.entries(group_service).map(([key, value]) => ({
      id_servicio: key,
      solicitudes: value,
    }));

    return array_services;
  } catch (error) {
    throw error;
  }
};

const getSolicitudById = async (id) => {
  try {
    let query = `
        select 
s.id_servicio,
s.created_at,
s.is_credito,
so.id_solicitud,
so.confirmation_code,
so.hotel,
so.check_in,
so.check_out,
so.room,
so.total,
h.comments,
so.id_usuario_generador,
so.nombre_viajero,
b.id_booking, 
h.codigo_reservacion_hotel, 
p.id_pago, 
p.pendiente_por_cobrar,
p.monto_a_credito,
fp.id_factura,
vw.primer_nombre,
vw.apellido_paterno,
vw.id_viajero
from solicitudes as so
LEFT JOIN servicios as s ON so.id_servicio = s.id_servicio
LEFT JOIN bookings as b ON so.id_solicitud = b.id_solicitud
LEFT JOIN hospedajes as h ON b.id_booking = h.id_booking
LEFT JOIN pagos as p ON so.id_servicio = p.id_servicio
LEFT JOIN facturas_pagos as fp ON p.id_pago = fp.id_pago
LEFT JOIN viajeros_con_empresas_con_agentes as vw ON vw.id_viajero = so.id_viajero
WHERE so.id_solicitud = ?
GROUP BY so.id_solicitud
ORDER BY s.created_at DESC;`;
    let response = await executeQuery(query, [id]);
    console.log(response);

    return response;
  } catch (error) {
    throw error;
  }
};

const getSolicitudesClientWithViajero = async (id) => {
  try {
    const query = `select 
p_c.id_credito,
p_c.pendiente_por_cobrar,
s.id_servicio,
s.created_at,
s.is_credito,
so.id_solicitud,
so.confirmation_code,
so.hotel,
so.check_in,
so.check_out,
so.room,
so.total,
so.status,
so.nombre_viajero,
so.id_usuario_generador,
b.id_booking, 
h.codigo_reservacion_hotel, 
p.id_pago,
p.monto_a_credito,
fp.id_factura,
vw.primer_nombre,
vw.apellido_paterno,
f.id_facturama
from solicitudes as so
LEFT JOIN servicios as s ON so.id_servicio = s.id_servicio
LEFT JOIN pagos_credito as p_c ON s.id_servicio = p_c.id_servicio
LEFT JOIN bookings as b ON so.id_solicitud = b.id_solicitud
LEFT JOIN hospedajes as h ON b.id_booking = h.id_booking
LEFT JOIN pagos as p ON so.id_servicio = p.id_servicio
LEFT JOIN facturas_pagos as fp ON p.id_pago = fp.id_pago
LEFT JOIN facturas as f ON fp.id_factura = f.id_factura
LEFT JOIN viajeros_con_empresas_con_agentes as vw ON vw.id_viajero = so.id_viajero
WHERE id_usuario_generador in (
	select id_empresa 
	from empresas_agentes 
	where id_agente = ?
) or id_usuario_generador = ?
GROUP BY so.id_solicitud
ORDER BY s.created_at DESC;`;

    // Ejecutar el procedimiento almacenado
    const response = await executeQuery(query, [id, id]);

    return response;
  } catch (error) {
    throw error;
  }
};
const getSolicitudesClient = async (user_id) => {
  try {
    let query = `
SELECT
    solicitudes.*,
    ROUND(solicitudes.total, 2) AS solicitud_total,
    servicios.created_at,
    hospedajes.nombre_hotel,
    pagos.*,
    CASE
        WHEN bookings.id_solicitud IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_booking,
    facturas.id_facturama
FROM servicios
LEFT JOIN solicitudes ON servicios.id_servicio = solicitudes.id_servicio
LEFT JOIN bookings ON solicitudes.id_solicitud = bookings.id_solicitud
LEFT JOIN hospedajes ON bookings.id_booking = hospedajes.id_booking
LEFT JOIN pagos ON solicitudes.id_servicio = pagos.id_servicio
LEFT JOIN facturas_pagos ON pagos.id_pago = facturas_pagos.id_pago
LEFT JOIN facturas ON facturas_pagos.id_factura = facturas.id_factura
WHERE solicitudes.id_usuario_generador = ?
ORDER BY servicios.created_at DESC;`;
    let response = await executeQuery(query, [user_id]);

    const formatResponse = response.map((item) => {
      return {
        ...item,
        hotel: item.hotel ? item.hotel : item.nombre_hotel,
      };
    });

    return formatResponse;
  } catch (error) {
    throw error;
  }
};

const getViajeroSolicitud = async (id_agente) => {
  try {
    let query = `select * from viajeros_con_empresas_con_agentes where id_viajero = ?; `;
    let params = [id_agente];
    let response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
};

const getViajeroAgenteSolicitud = async (id_agente) => {
  try {
    let query = `select * from viajeros_con_empresas_con_agentes where id_agente = ?; `;
    let params = [id_agente];
    let response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
};

const getSolicitudesConsultas = async (user_id) => {
  try {
    let query = `
SELECT
  solicitudes.id_solicitud,
  solicitudes.id_servicio,
  solicitudes.confirmation_code,
  solicitudes.id_viajero,
  solicitudes.hotel,
  solicitudes.check_in,
  solicitudes.check_out,
  solicitudes.room,
  solicitudes.total,
  solicitudes.status,
  solicitudes.id_usuario_generador,
  solicitudes.nombre_viajero,
  ROUND(solicitudes.total, 2) AS solicitud_total,
  servicios.created_at,
  hospedajes.nombre_hotel,
  hospedajes.codigo_reservacion_hotel,
  viajeros.*,
  IF(bookings.id_solicitud IS NOT NULL, TRUE, FALSE) AS is_booking,

  -- JSON con todos los pagos relacionados a esta solicitud
  (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id_pago', p.id_pago,
        'monto', p.monto,
        'monto_a_credito', p.monto_a_credito,
        'responsable_pago_empresa', p.responsable_pago_empresa,
        'responsable_pago_agente', p.responsable_pago_agente,
        'fecha_creacion', p.created_at,
        'pago_por_credito', p.pago_por_credito,
        'pendiente_por_cobrar', p.pendiente_por_cobrar,
        'subtotal', p.subtotal,
        'impuestos', p.impuestos,
        'updated_at', p.updated_at,
        'padre', p.padre,
        'concepto', p.concepto,
        'referencia', p.referencia,
        'fecha_pago', p.fecha_pago,
        'spei', p.spei,
        'banco', p.banco,
        'autorizacion_stripe', p.autorizacion_stripe,
        'last_digits', p.last_digits,
        'fecha_transaccion', p.fecha_transaccion,
        'currency', p.currency,
        'metodo_de_pago', p.metodo_de_pago,
        'tipo_de_tarjeta', p.tipo_de_tarjeta,
        'tipo_de_pago', p.tipo_de_pago
      )
    )
    FROM pagos p
    WHERE p.id_servicio = solicitudes.id_servicio
  ) AS pagos,

  -- JSON con todas las facturas relacionadas a los pagos de esta solicitud
  (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id_factura', f.id_factura,
        'id_facturama', f.id_facturama,
        'fecha_emision', f.created_at,
        'RFC', f.rfc,
        'id_empresa', f.id_empresa,
        'folio', f.id_facturama,
        'monto_factura', f.total,
        'razon_social', e.razon_social
      )
    )
    FROM pagos p
    JOIN facturas_pagos fp ON p.id_pago = fp.id_pago
    JOIN facturas f ON fp.id_factura = f.id_factura
    JOIN empresas e ON f.id_empresa = e.id_empresa
    WHERE p.id_servicio = solicitudes.id_servicio
  ) AS facturas

FROM servicios
LEFT JOIN solicitudes ON servicios.id_servicio = solicitudes.id_servicio
LEFT JOIN bookings ON solicitudes.id_solicitud = bookings.id_solicitud
LEFT JOIN hospedajes ON bookings.id_booking = hospedajes.id_booking
LEFT JOIN viajeros ON solicitudes.id_viajero = viajeros.id_viajero
WHERE solicitudes.id_solicitud IS NOT NULL
  AND solicitudes.id_usuario_generador = ?
ORDER BY servicios.created_at DESC;`;
    let response = await executeQuery(query, [user_id]);

    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSolicitudYTicket,
  getViajeroSolicitud,
  getSolicitudes,
  createSolicitudes,
  getSolicitudesClient,
  getSolicitudesClientWithViajero,
  getSolicitudById,
  getViajeroAgenteSolicitud,
  getSolicitudesConsultas,
};
