const { executeTransaction, executeQuery } = require("../../../config/db");
const {supabase} = require("../../../config/auth")

const createAgente = async (data) => {
  try {
    console.log(data)
    let query = `INSERT INTO agentes (id_agente, nombre) VALUES (?,?)`;
    let nombre = [data.primer_nombre, data.segundo_nombre, data.apellido_paterno, data.apellido_materno].filter(item => !!item).join(" ");
    let params = [data.id, nombre];
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

const getAgenteEmpresa = async (id_agente) => {
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

const getEmpresasDatosFiscales = async (id_agente) => {
  try {
    const query = "SELECT * FROM vw_datos_fiscales_detalle WHERE id_agente = ?";
    const params = [id_agente];
    const response = await executeQuery(query, params);
    console.log("hola");
    console.log(response);
    return response;
  } catch (error) {
    throw error
  }
}

const getAllAgentes = async () => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    return data;
  } catch (error) {
    throw error
  }
}

module.exports = {
  createAgente,
  getAgente,
  getAgenteEmpresa,
  getEmpresasDatosFiscales,
  getAllAgentes
}