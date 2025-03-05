const { executeTransaction, executeQuery } = require("../../../config/db");

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

const getSolicitudes = async () => {
  try {
    let query = `SELECT * FROM solicitudes`;
    let response = await executeQuery(query);
    return response;

  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSolicitudYTicket,
  getSolicitudes
}