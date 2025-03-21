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
    const total = solicitudes.reduce((prev, current) => prev + current.total, 0); // Changed from total_price to total
    const subtotal = parseFloat((total * 0.84).toFixed(2));
    const impuestos = parseFloat((total * 0.16).toFixed(2));
    const params_servicio = [id_servicio, total, subtotal, impuestos, null, null, null];

    const response = await executeTransaction(
      query_servicio,
      params_servicio,
      async (results, connection) => {
        try {
          const query_solicitudes = `INSERT INTO solicitudes (id_solicitud, id_servicio, confirmation_code, id_viajero, hotel, check_in, check_out, room, total, status) VALUES ${solicitudes
            .map(() => "(?,?,?,?,?,?,?,?,?,?)")
            .join(",")};`;

          const params_solicitudes = solicitudes.flatMap((solicitud) => {
            let id_solicitud = `sol-${uuidv4()}`;
            // Correct destructuring to match incoming data keys
            const {
              confirmation_code,
              id_viajero,
              hotel,       // Previously hotel_name (incorrect)
              check_in,
              check_out,
              room,        // Previously room_type (incorrect)
              total,       // Previously total_price (incorrect)
              status,
            } = solicitud;
            return [
              id_solicitud,
              id_servicio,
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

          const response_solicitudes = await connection.execute(
            query_solicitudes,
            params_solicitudes
          );
          console.log(response_solicitudes);
          return {id_servicio: id_servicio};
        } catch (error) {
          throw error;
        }
      }
    );

    return {id_servicio: id_servicio};;
  } catch (error) {
    throw error;
  }
};

const getSolicitudes = async () => {
  try {
    let query = `select solicitudes.*, ROUND(solicitudes.total, 2) as solicitud_total, servicios.created_at from servicios left join solicitudes on servicios.id_servicio = solicitudes.id_servicio order by created_at desc;`;
    let response = await executeQuery(query);
    let group_service = Object.groupBy(response, ({ id_servicio }) => id_servicio)
    let array_services = Object.entries(group_service).map(([key, value]) => ({ id_servicio: key, solicitudes: value }))

    return array_services;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSolicitudYTicket,
  getSolicitudes,
  createSolicitudes
}