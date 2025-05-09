const { executeTransaction, executeQuery } = require("../../../config/db");
const { v4: uuidv4 } = require("uuid")

const createSolicitudYTicket = async (solicitud) => {
  try {
    let query = `INSERT INTO solicitudes (confirmation_code, id_viajero, hotel, check_in, check_out, room, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [solicitud.confirmation_code, solicitud.id_viajero, solicitud.hotel_name, solicitud.check_in, solicitud.check_out, solicitud.room_type, solicitud.total_price, solicitud.status];

    let response = await executeTransaction(query, params, async (results, connection) => {
      console.log("Creamos el ticket")
    });

    return response;

  } catch (error) {
    throw error;
  }
}

const createSolicitudes = async (body) => {
  try {
    const { solicitudes } = body;
    const id_servicio = `ser-${uuidv4()}`;
    const query_servicio = `INSERT INTO servicios (id_servicio, total, subtotal, impuestos, is_credito, otros_impuestos, fecha_limite_pago) VALUES (?,?,?,?,?,?,?);`;
    const total = solicitudes.reduce((prev, current) => prev + current.total, 0);
    const subtotal = parseFloat((total * 0.84).toFixed(2));
    const impuestos = parseFloat((total * 0.16).toFixed(2));
    const params_servicio = [id_servicio, total, subtotal, impuestos, null, null, null];

    const response = await executeTransaction(
      query_servicio,
      params_servicio,
      async (results, connection) => {
        try {
          const query_solicitudes = `INSERT INTO solicitudes (id_solicitud, id_servicio, id_usuario_generador, confirmation_code, id_viajero, hotel, check_in, check_out, room, total, status) VALUES ${solicitudes
            .map(() => "(?,?,?,?,?,?,?,?,?,?,?)")
            .join(",")};`;

          const params_solicitudes_map = solicitudes.map((solicitud) => {
            let id_solicitud = `sol-${uuidv4()}`;
            // Correct destructuring to match incoming data keys
            const {
              confirmation_code,
              id_viajero,
              hotel,
              check_in,
              check_out,
              room,
              total,
              status,
            } = solicitud;
            return [
              id_solicitud,
              id_servicio,
              id_viajero,
              confirmation_code,
              id_viajero,
              hotel,
              check_in,
              check_out,
              room,
              total,
              status,
            ];
          });
          const params_solicitudes_flat = params_solicitudes_map.flat()

          const response_solicitudes = await connection.execute(
            query_solicitudes,
            params_solicitudes_flat
          );
          return params_solicitudes_map.map(list => list[0]);
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
    let query = `select solicitudes.*, ROUND(solicitudes.total, 2) as solicitud_total, servicios.created_at from servicios left join solicitudes on servicios.id_servicio = solicitudes.id_servicio order by created_at desc;`;
    let response = await executeQuery(query);
    console.log(response)

    let group_service = response.reduce((acc, item) => {
      if (!acc[item.id_servicio]) {
        acc[item.id_servicio] = []
      }
      acc[item.id_servicio].push(item)
      return acc
    }, {})
    let array_services = Object.entries(group_service).map(([key, value]) => ({ id_servicio: key, solicitudes: value }))

    return array_services;
  } catch (error) {
    throw error;
  }
}

const getSolicitudById = async (id) => {
  try {
    let query = `
    select solicitudes.*, ROUND(solicitudes.total, 2) as solicitud_total, servicios.created_at 
    from servicios 
    left join solicitudes on servicios.id_servicio = solicitudes.id_servicio 
    WHERE id_solicitud = ?
    order by created_at desc;`;
    let response = await executeQuery(query, [id]);
    console.log(response)

    return response;
  } catch (error) {
    throw error;
  }
}

const getSolicitudesClientWithViajero = async (user_id) => {
  try {
    let query = `
      select * from vw_viajeros_con_empresas where id_agente = ?;`;
    let response = await executeQuery(query, [user_id]);

    return response;
  } catch (error) {
    throw error;
  }
}
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
ORDER BY servicios.created_at DESC;`
    let response = await executeQuery(query, [user_id]);

    const formatResponse = response.map((item) => {
      return {
        ...item,
        hotel: item.hotel ? item.hotel : item.nombre_hotel
      }
    })

    return formatResponse;
  } catch (error) {
    throw error;
  }
}

const getViajeroSolicitud = async (id_agente) => {
  try {
    let query = `select * from viajeros_con_empresas_con_agentes where id_agente = ?; `
    let params = [id_agente]
    let response = await executeQuery(query, params)
    return response;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  createSolicitudYTicket,
  getViajeroSolicitud,
  getSolicitudes,
  createSolicitudes,
  getSolicitudesClient,
  getSolicitudesClientWithViajero,
  getSolicitudById
}