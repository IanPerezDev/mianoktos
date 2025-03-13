const { executeTransaction, executeQuery } = require("../../../config/db");

const createEmpresa = async() => {
  try {
    let query = `INSERT INTO empresas (id_agente, primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let params = [data.id, data.name, data.secondName, data.lastname1, data.lastname2, data.email, data.phone];
    let response = await executeQuery(query, params);
    console.log(response);

    return response;
  } catch (error) {
    throw error
  }
}
const getEmpresas = () => {
  try {
    //Aqui se escribe el codigo
    return { message: "Estoy en obteniendo empresa" }
  } catch (error) {
    throw error
  }
}

module.exports = {
  createEmpresa,
  getEmpresas
}