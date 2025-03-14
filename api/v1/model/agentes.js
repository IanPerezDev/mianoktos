const { executeTransaction, executeQuery } = require("../../../config/db");

const createAgente = async (data) => {
  try {
    let query = `INSERT INTO agentes (id_agente) VALUES (?)`;
    let params = [data.id];
    let response = await executeQuery(query, params);
    console.log(response);

    return response;
  } catch (error) {
    throw error
  }
}

const getAgente = async (id_agente) => {
  try {
    const query = "SELECT * FROM viajeros_con_empresas_con_agentes WHERE id_agente = ?";
    const params = [id_agente];
    const response = await executeQuery(query, params);
    console.log(response);
    return response;
  } catch (error) {
    throw error
  }
}

const getAgenteEmpresa = async(id_agente) => {
  try {
    const query = "SELECT * FROM empresas_con_agentes WHERE id_agente = ?";
    const params = [id_agente];
    const response = await executeQuery(query, params);
    console.log("hola");
    console.log(response);
    return response;
  } catch (error) {
    throw error
  }
}

module.exports = {
  createAgente,
  getAgente,
  getAgenteEmpresa
}