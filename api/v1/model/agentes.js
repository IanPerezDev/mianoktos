const { executeTransaction, executeQuery } = require("../../../config/db");

const createAgente = async (data) => {
  try {
    let query = `INSERT INTO agentes (id_agente, primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let params = [data.id, data.name, data.secondName, data.lastname1, data.lastname2, data.email, data.phone];
    let response = await executeQuery(query, params);
    console.log(response);

    return response;
  } catch (error) {
    throw error
  }
}
const getAgente = async (data) => {
  try {

  } catch (error) {
    throw error
  }
}

module.exports = {
  createAgente,
  getAgente
}