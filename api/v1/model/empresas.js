const { executeQuery, executeTransaction } = require("../../../config/db");
const { v4: uuidv4 } = require("uuid");

const createEmpresa = async (empresa) => {
  try {
    const id_empresa = `emp-${uuidv4()}`

    const query = "INSERT INTO  empresas (id_empresa, razon_social, rfc, nombre_comercial, direccion, direccion_fiscal, codigo_postal_fiscal, regimen_fiscal) VALUES (?,?,?,?,?,?,?,?);"
    let params = [id_empresa, empresa.razon_social, empresa.rfc, empresa.nombre_comercial, empresa.direccion, empresa.direccion_fiscal, empresa.codigo_postal_fiscal, empresa.regimen_fiscal]
    const response = await executeQuery(query, params)

    return response
  } catch (error) {
    throw error
  }
}
const getEmpresas = async () => {
  try {
    const query = "SELECT * FROM empresas"
    const response = await executeQuery(query)
    return response
  } catch (error) {
    throw error
  }
}

module.exports = {
  createEmpresa,
  getEmpresas
}